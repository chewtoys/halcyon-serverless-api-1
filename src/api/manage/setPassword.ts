import * as repository from '../../repositories/userRepository';
import * as password from '../../utils/password';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    newPassword: validators.newPassword
};

const httpHandler: IHttpHandler = async request => {
    const { body, currentUserId } = request;

    const user = await repository.getUserById(currentUserId);
    if (!user) {
        return generateResponse(404, ['User not found.']);
    }

    if (user.password) {
        return generateResponse(400, ['User already has a password set.']);
    }

    user.password = await password.hash(body.newPassword);
    user.passwordResetToken = undefined;
    await repository.updateUser(user);

    return generateResponse(200, ['Your password has been set.']);
};

export const handler = handleRequest(httpHandler, schema);
