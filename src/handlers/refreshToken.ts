import { IHandlerRequest, IHandlerResponse } from '.';
import { getUserByRefreshToken } from '../repositories/userRepository';

export const authenticate = async (
    model: IHandlerRequest
): Promise<IHandlerResponse> => {
    const user = await getUserByRefreshToken(model.refreshToken);
    if (!user) {
        return undefined;
    }

    if (user.isLockedOut) {
        return {
            isLockedOut: true
        };
    }

    user.refreshTokens = user.refreshTokens.filter(
        rt => rt.token !== model.refreshToken
    );

    return {
        user
    };
};
