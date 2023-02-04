import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
    errCode1,
    errCode2,
    saltBcrypt,
    successCode,
    dataCode
} from '../utils/functions.utils';

import { UserServices } from '../services/user.services';

import { redisClient as client } from '../databases/init.redis';

import { signAccessToken, signRefreshToken } from '../middlewares/signToken';

import { userModel } from '../models/user.model';
import { Error as ErrorLogger } from '../utils/logger';

const user_services = new UserServices();

class AuthenticationController {
    // [POST] /authentication/register
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, username, password } = req.body;
            if (!email || !username || !password) {
                errCode2(next, 'Input is not enough in register');
            } else {
                const findUserByEmail = await userModel.findOne({
                    'payment.email': email
                });
                if (findUserByEmail) {
                    errCode2(next, `User is already with email = ${email}`);
                } else {
                    const findUSerByUsername = await userModel.findOne({
                        'payment.username': username
                    });
                    if (findUSerByUsername) {
                        errCode2(
                            next,
                            `User is already with username = ${username}`
                        );
                    } else {
                        bcrypt
                            .hash(password, saltBcrypt)
                            .then(async (hashed) => {
                                if (!hashed) {
                                    errCode2(
                                        next,
                                        `Something error when hash password`
                                    );
                                }
                                user_services
                                    .create_user({
                                        username: username,
                                        email: email,
                                        password: hashed
                                    })
                                    .then((result: any) => {
                                        dataCode(res, result.data);
                                    })
                                    .catch((err) => {
                                        errCode2(next, err.message);
                                    });
                            })
                            .catch((err) => errCode1(next, err));
                    }
                }
            }
        } catch (error: any) {
            next(error);
        }
    }

    // [POST] /authentication/login
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                errCode2(next, 'Input is not enough in register');
            } else {
                const userFindByEmail = await userModel.findOne({
                    email: email
                });
                if (!userFindByEmail) {
                    const userFindByUsername = await userModel.findOne({
                        username: email
                    });
                    if (!userFindByUsername) {
                        errCode2(
                            next,
                            `User is not valid with username, email = ${email}`
                        );
                    } else {
                        bcrypt
                            .compare(
                                password,
                                userFindByUsername.payment.password
                            )
                            .then((match) => {
                                if (!match) {
                                    errCode2(
                                        next,
                                        `username, email, password is false`
                                    );
                                } else {
                                    const accessToken = signAccessToken(
                                        userFindByUsername._id
                                    );
                                    const refreshToken = signRefreshToken(
                                        userFindByUsername._id
                                    );

                                    res.cookie('jwt', refreshToken, {
                                        httpOnly: true,
                                        sameSite: 'strict',
                                        secure: false,
                                        maxAge: 60 * 1000 * 60
                                    });
                                    client.set(
                                        `${userFindByUsername._id}_access_token`,
                                        accessToken,
                                        {
                                            EX: 30 * 60
                                        }
                                    );
                                    client.set(
                                        `${userFindByUsername._id}_refresh_token`,
                                        refreshToken,
                                        {
                                            EX: 200 * 24 * 60 * 60
                                        }
                                    );
                                    return dataCode(res, {
                                        accessToken: accessToken,
                                        user: userFindByUsername
                                    });
                                }
                            })
                            .catch((err) => errCode1(next, err));
                    }
                } else {
                    bcrypt
                        .compare(password, userFindByEmail.payment.password)
                        .then((match) => {
                            if (!match) {
                                errCode2(
                                    next,
                                    `username, email, password is false`
                                );
                            } else {
                                const accessToken = signAccessToken(
                                    userFindByEmail._id
                                );
                                const refreshToken = signRefreshToken(
                                    userFindByEmail._id
                                );

                                res.cookie('jwt', refreshToken, {
                                    httpOnly: true,
                                    sameSite: 'strict',
                                    secure: false,
                                    maxAge: 60 * 1000 * 60
                                });
                                client.set(
                                    `${userFindByEmail._id}_access_token`,
                                    accessToken,
                                    {
                                        EX: 30 * 60
                                    }
                                );
                                client.set(
                                    `${userFindByEmail._id}_refresh_token`,
                                    refreshToken,
                                    {
                                        EX: 200 * 24 * 60 * 60
                                    }
                                );
                                return dataCode(res, {
                                    accessToken: accessToken,
                                    user: userFindByEmail
                                });
                            }
                        })
                        .catch((err: any) => {
                            errCode1(next, err);
                        });
                }
            }
        } catch (error: any) {
            next(error);
        }
    }

    // [GET] /authentication/refreshToken/:idUser
    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const refreshTokenFind = await client.get(
                `${idUser}_refresh_token`
            );
            if (!refreshTokenFind) {
                throw Error(
                    `Refresh token is not valid or not true. Please login again!`
                );
            }
            jwt.verify(
                refreshTokenFind,
                `${process.env.REFRESH_TOKEN_JWT_SECRET}`,
                async (err: any, decoded: any) => {
                    if (err) throw Error(err.message);
                    const newToken = signAccessToken(decoded.uid);
                    client.set(`${decoded.uid}_access_token`, newToken, {
                        EX: 30 * 60
                    });
                    dataCode(res, newToken);
                }
            );
        } catch (error: any) {
            const errorLog = new ErrorLogger(404, error.message);
            next(errorLog);
        }
    }

    // [GET] /authentication/logout/:idUser
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            client.del(`${idUser}_access_token`);
            client.del(`${idUser}_refresh_token`);
            successCode(res, 'Logout successfully');
        } catch (error: any) {
            next(error);
        }
    }
}

export { AuthenticationController };
