import uuidv4 from 'uuid/v4';
import * as repository from '../../repositories/userRepository';
import * as password from '../../utils/password';
import * as email from '../../utils/email';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    emailAddress: validators.emailAddress,
    password: validators.password,
    firstName: validators.firstName,
    lastName: validators.lastName,
    dateOfBirth: validators.dateOfBirth
};

const httpHandler: IHttpHandler = async request => {
    const { body } = request;

    const existing = await repository.getUserByEmailAddress(body.emailAddress);
    if (existing) {
        return generateResponse(400, [
            `User name "${body.emailAddress}" is already taken.`
        ]);
    }

    const user = {
        emailAddress: body.emailAddress,
        password: await password.hash(body.password),
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth,
        verifyEmailToken: uuidv4()
    };

    await repository.createUser(user);

    await email.send({
        to: user.emailAddress,
        template: 'verifyEmail',
        context: {
            code: user.verifyEmailToken
        }
    });

    return generateResponse(200, ['User successfully registered.']);
};

export const handler = handleRequest(httpHandler, schema);
