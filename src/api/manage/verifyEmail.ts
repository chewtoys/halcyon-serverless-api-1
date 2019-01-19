import uuidv4 from 'uuid/v4';
import * as repository from '../../repositories/userRepository';
import * as email from '../../utils/email';
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

    if (user.emailConfirmed) {
        return generateResponse(400, [
            'Your email address has already been verified.'
        ]);
    }

    user.verifyEmailToken = uuidv4();
    await repository.updateUser(user);

    await email.send({
        to: user.emailAddress,
        template: 'verifyEmail',
        context: {
            code: user.verifyEmailToken
        }
    });

    return generateResponse(200, [
        'Instructions as to how to verify your email address have been sent to you via email.'
    ]);
};

export const handler = handleRequest(httpHandler);
