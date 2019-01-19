import * as repository from '../../repositories/userRepository';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const httpHandler: IHttpHandler = async request => {
    const { params, currentUserId } = request;

    const user = await repository.getUserById(params.id);
    if (!user) {
        return generateResponse(404, ['User not found.']);
    }

    if (user.id === currentUserId) {
        return generateResponse(400, [
            'Cannot delete currently logged in user.'
        ]);
    }

    await repository.removeUser(user);

    return generateResponse(200, ['User successfully deleted.']);
};

export const handler = handleRequest(httpHandler);
