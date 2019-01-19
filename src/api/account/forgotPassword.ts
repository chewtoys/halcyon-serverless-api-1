import uuidv4 from 'uuid/v4';
import * as repository from '../../repositories/userRepository';
import * as email from '../../utils/email';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    emailAddress: validators.emailAddress
};

const httpHandler: IHttpHandler = async request => {
    const { body } = request;

    const user = await repository.getUserByEmailAddress(body.emailAddress);

    if (user) {
        user.passwordResetToken = uuidv4();
        await repository.updateUser(user);

        await email.send({
            to: user.emailAddress,
            template: 'resetPassword',
            context: {
                code: user.passwordResetToken
            }
        });
    }

    return generateResponse(200, [
        'Instructions as to how to reset your password have been sent to you via email.'
    ]);
};

export const handler = handleRequest(httpHandler, schema);
