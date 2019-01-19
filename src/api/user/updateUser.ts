import * as repository from '../../repositories/userRepository';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    emailAddress: validators.emailAddress,
    firstName: validators.firstName,
    lastName: validators.lastName,
    dateOfBirth: validators.dateOfBirth
};

const httpHandler: IHttpHandler = async request => {
    const { body, params } = request;

    const user = await repository.getUserById(params.id);
    if (!user) {
        return generateResponse(404, ['User not found.']);
    }

    if (user.emailAddress !== body.emailAddress) {
        const existing = await repository.getUserByEmailAddress(
            body.emailAddress
        );

        if (existing) {
            return generateResponse(400, [
                `User name "${body.emailAddress}" is already taken.`
            ]);
        }

        user.emailConfirmed = undefined;
        user.verifyEmailToken = undefined;
    }

    user.emailAddress = body.emailAddress;
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.dateOfBirth = body.dateOfBirth;
    user.roles = body.roles;
    await repository.updateUser(user);

    return generateResponse(200, ['User successfully updated.']);
};

export const handler = handleRequest(httpHandler, schema);
