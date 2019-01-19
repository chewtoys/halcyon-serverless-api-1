import * as repository from '../../repositories/userRepository';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    code: validators.code
};

const httpHandler: IHttpHandler = async request => {
    const { body, currentUserId } = request;

    const user = await repository.getUserById(currentUserId);
    if (!user) {
        return generateResponse(404, ['User not found.']);
    }

    if (body.code !== user.verifyEmailToken) {
        return generateResponse(400, ['Invalid token.']);
    }

    user.emailConfirmed = true;
    user.verifyEmailToken = undefined;
    await repository.updateUser(user);

    return generateResponse(200, ['Your email address has been verified.']);
};

export const handler = handleRequest(httpHandler, schema);
