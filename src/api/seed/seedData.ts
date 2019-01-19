import * as repository from '../../repositories/userRepository';
import * as password from '../../utils/password';
import config from '../../utils/config';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const httpHandler: IHttpHandler = async () => {
    const user = {
        emailAddress: config.SEED_EMAIL_ADDRESS,
        password: await password.hash(config.SEED_PASSWORD),
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: '1970-01-01',
        roles: ['System Administrator']
    };

    const existing = await repository.getUserByEmailAddress(user.emailAddress);
    if (existing) {
        await existing.remove();
    }

    await repository.createUser(user);

    return generateResponse(200, ['Database seeded.']);
};

export const handler = handleRequest(httpHandler);
