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
    accessToken: validators.accessToken,
    emailAddress: validators.emailAddress,
    firstName: validators.firstName,
    lastName: validators.lastName,
    dateOfBirth: validators.dateOfBirth
};

const httpHandler: IHttpHandler = async request => {
    const { body } = request;

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

    let existing = await repository.getUserByEmailAddress(body.emailAddress);
    if (existing) {
        return generateResponse(400, [
            `User name "${body.emailAddress}" is already taken.`
        ]);
    }

    existing = await repository.getUserByLogin(
        body.provider,
        externalUser.userId
    );

    if (existing) {
        return generateResponse(400, [
            'A user with this login already exists.'
        ]);
    }

    const user = {
        emailAddress: body.emailAddress,
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth,
        logins: [
            {
                provider: body.provider,
                externalId: externalUser.userId
            }
        ]
    };

    await repository.createUser(user);

    return generateResponse(200, ['User successfully registered.']);
};

export const handler = handleRequest(httpHandler, schema);
