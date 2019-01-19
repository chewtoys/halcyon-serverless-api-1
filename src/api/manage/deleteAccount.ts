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

    await repository.removeUser(user);

    return generateResponse(200, ['Your account has been deleted.']);
};

export const handler = handleRequest(httpHandler);
