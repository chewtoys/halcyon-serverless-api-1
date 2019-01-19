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

    user.twoFactorEnabled = undefined;
    user.twoFactorSecret = undefined;
    await repository.updateUser(user);

    return generateResponse(200, [
        'Two factor authentication has been disabled.'
    ]);
};

export const handler = handleRequest(httpHandler);
