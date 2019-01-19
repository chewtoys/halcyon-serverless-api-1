import * as repository from '../../repositories/userRepository';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const httpHandler: IHttpHandler = async request => {
    const { currentUserId } = request;

    const user = await repository.getUserById(currentUserId);
    if (!user) {
        return generateResponse(404, ['User not found.']);
    }

    return generateResponse(200, undefined, {
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        hasPassword: !!user.password,
        emailConfirmed: user.emailConfirmed,
        twoFactorEnabled: user.twoFactorEnabled,
        gravatarUrl: user.gravatarUrl,
        logins: user.logins.map(login => ({
            provider: login.provider,
            externalId: login.externalId
        }))
    });
};

export const handler = handleRequest(httpHandler);
