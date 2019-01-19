import * as repository from '../../repositories/userRepository';
import * as twoFactor from '../../utils/twoFactor';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    verificationCode: validators.verificationCode
};

const httpHandler: IHttpHandler = async request => {
    const { body, currentUserId } = request;

    const user = await repository.getUserById(currentUserId);
    if (!user) {
        return generateResponse(404, ['User not found.']);
    }

    const valid = twoFactor.verify(
        body.verificationCode,
        user.twoFactorTempSecret
    );

    if (!valid) {
        return generateResponse(400, [
            'Verification with authenticator app was unsuccessful.'
        ]);
    }

    user.twoFactorEnabled = true;
    user.twoFactorSecret = `${user.twoFactorTempSecret}`;
    user.twoFactorTempSecret = undefined;

    await repository.updateUser(user);

    return generateResponse(200, [
        'Two factor authentication has been enabled.'
    ]);
};

export const handler = handleRequest(httpHandler, schema);
