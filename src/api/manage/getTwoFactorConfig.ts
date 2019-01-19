import * as repository from '../../repositories/userRepository';
import * as twoFactor from '../../utils/twoFactor';
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

    const result = twoFactor.generate(`Halcyon (${user.emailAddress})`);

    user.twoFactorTempSecret = result.secret;
    await repository.updateUser(user);

    return generateResponse(200, undefined, result);
};

export const handler = handleRequest(httpHandler);
