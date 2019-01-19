import handlers from '../../handlers';
import jwt from '../../utils/jwt';
import { validators } from '../../utils/validators';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const schema = {
    grantType: validators.grantType
};

const httpHandler: IHttpHandler = async request => {
    const { body } = request;

    const authHandler = handlers[body.grantType];
    if (!authHandler) {
        return generateResponse(400, [
            `Grant Type "${body.provider}" is not supported.`
        ]);
    }

    const result = await authHandler.authenticate(body);
    if (!result) {
        return generateResponse(400, [
            'The credentials provided were invalid.'
        ]);
    }

    if (result.requiresTwoFactor || result.requiresExternal) {
        return generateResponse(400, undefined, result);
    }

    if (result.isLockedOut) {
        return generateResponse(400, [
            'This account has been locked out, please try again later.'
        ]);
    }

    if (!result.user) {
        return generateResponse(400, [
            'The credentials provided were invalid.'
        ]);
    }

    const token = await jwt(result.user);
    return generateResponse(200, undefined, token);
};

export const handler = handleRequest(httpHandler, schema);
