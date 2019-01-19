import * as repository from '../../repositories/userRepository';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const httpHandler: IHttpHandler = async request => {
    const { params } = request;

    const user = await repository.getUserById(params.id);
    if (!user) {
        return generateResponse(404, ['User not found.']);
    }

    return generateResponse(200, undefined, {
        id: user.id,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        isLockedOut: user.isLockedOut,
        hasPassword: !!user.password,
        emailConfirmed: user.emailConfirmed,
        twoFactorEnabled: user.twoFactorEnabled,
        roles: user.roles,
        gravatarUrl: user.gravatarUrl
    });
};

export const handler = handleRequest(httpHandler);
