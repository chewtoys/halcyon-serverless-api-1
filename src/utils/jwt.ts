import jsonWebToken from 'jsonwebtoken';
import { IUserModel } from '../models/user';
import { updateUser } from '../repositories/userRepository';
import uuidv4 from 'uuid/v4';
import config from './config';

const jwt = async (user: IUserModel) => {
    const expiresIn = 3600;

    const payload = {
        sub: user.id,
        email: user.emailAddress,
        given_name: user.firstName,
        family_name: user.lastName,
        picture: user.gravatarUrl,
        role: user.roles && user.roles.join()
    };

    const accessToken = jsonWebToken.sign(payload, config.JWT_SECURITY_KEY, {
        expiresIn
    });

    const refreshToken = await generateRefreshToken(user);

    return {
        accessToken,
        refreshToken,
        expiresIn
    };
};

const generateRefreshToken = async (user: IUserModel) => {
    user.refreshTokens = user.refreshTokens
        .sort((rt1, rt2) =>
            rt1.issued.getTime() > rt2.issued.getTime() ? -1 : 1
        )
        .filter((rt, index) => index < 10);

    const refreshToken = {
        token: uuidv4(),
        issued: new Date()
    };

    user.refreshTokens.push(refreshToken);
    await updateUser(user);

    return refreshToken.token;
};

export default jwt;
