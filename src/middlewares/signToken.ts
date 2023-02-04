import jwt from 'jsonwebtoken';

import {
    ACCESS_TOKEN_JWT_SECRET,
    REFRESH_TOKEN_JWT_SECRET
} from '../configs/configs';

const signAccessToken = (userId: any) => {
    const accessToken = jwt.sign({ uid: userId }, ACCESS_TOKEN_JWT_SECRET, {
        expiresIn: '30m'
    });
    return accessToken;
};

const signRefreshToken = (userId: any) => {
    const refreshToken = jwt.sign({ uid: userId }, REFRESH_TOKEN_JWT_SECRET, {
        expiresIn: '200d'
    });
    return refreshToken;
};

export { signAccessToken, signRefreshToken };
