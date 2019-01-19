import * as repository from '../../repositories/userRepository';
import * as password from '../../utils/password';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    code: validators.code,
    emailAddress: validators.emailAddress,
    newPassword: validators.newPassword
};

const httpHandler: IHttpHandler = async request => {
    const { body } = request;

    const user = await repository.getUserByEmailAddress(body.emailAddress);
    if (!user || user.passwordResetToken !== body.code) {
        return generateResponse(400, ['Invalid token.']);
    }

    user.password = await password.hash(body.newPassword);
    user.passwordResetToken = undefined;
    user.twoFactorEnabled = undefined;
    user.twoFactorSecret = undefined;
    await repository.updateUser(user);

    return generateResponse(200, ['Your password has been reset.']);
};

export const handler = handleRequest(httpHandler, schema);
