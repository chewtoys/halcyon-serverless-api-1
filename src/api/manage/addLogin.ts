import * as repository from '../../repositories/userRepository';
import providers from '../../providers';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    provider: validators.provider,
    accessToken: validators.accessToken
};

const httpHandler: IHttpHandler = async request => {
    const { body, currentUserId } = request;

    const user = await repository.getUserById(currentUserId);
    if (!user) {
        return generateResponse(404, ['User not found.']);
    }

    const provider = providers[body.provider];
    if (!provider) {
        return generateResponse(400, [
            `Provider "${body.provider}" is not supported.`
        ]);
    }

    const externalUser = await provider.getUser(body.accessToken);
    if (!externalUser) {
        return generateResponse(400, [
            'The credentials provided were invalid.'
        ]);
    }

    const existing = await repository.getUserByLogin(
        body.provider,
        externalUser.userId
    );

    if (existing) {
        return generateResponse(400, [
            'A user with this login already exists.'
        ]);
    }

    user.logins.push({
        provider: body.provider,
        externalId: externalUser.userId
    });

    await repository.updateUser(user);

    return generateResponse(200, [`${body.provider} login added.`]);
};

export const handler = handleRequest(httpHandler, schema);
