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

    user.isLockedOut = undefined;
    await repository.updateUser(user);

    return generateResponse(200, ['User successfully unlocked.']);
};

export const handler = handleRequest(httpHandler);
