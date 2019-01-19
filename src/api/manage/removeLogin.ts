import * as repository from '../../repositories/userRepository';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    provider: validators.provider,
    externalId: validators.externalId
};

const httpHandler: IHttpHandler = async request => {
    const { body, currentUserId } = request;

    const user = await repository.getUserById(currentUserId);
    if (!user) {
        return generateResponse(404, ['User not found.']);
    }

    user.logins = user.logins.filter(
        login =>
            login.provider !== body.provider &&
            login.externalId !== body.externalId
    );
    await repository.updateUser(user);

    return generateResponse(200, [`${body.provider} login removed.`]);
};

export const handler = handleRequest(httpHandler, schema);
