import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response, Express } from 'express';
import { userModel as User } from '../models/user.model';
// import { ACCESS_TOKEN_JWT_SECRET } from '../configs/configs';
import { redisClient as client } from '../databases/init.redis';
import { errCode1, errCode2 } from '../utils/functions.utils';
import { userType } from '../types/user.type';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string =
            req.body?.token ||
            req?.headers['token'] ||
            req.body?.headers?.token;
        // const token: any = req.headers['token'];
        if (token == null || token === undefined) {
            throw Error('A token is required for authentication');
        }
        jwt.verify(
            token,
            `${process.env.ACCESS_TOKEN_JWT_SECRET}`,
            async (err: any, decoded: any) => {
                if (err) {
                    errCode2(next, 'JWT is expired or not valid');
                } else if (!decoded) {
                    errCode2(next, 'User is not valid');
                } else {
                    const userFindById = await User.findById(decoded.uid);
                    if (!userFindById) {
                        errCode2(next, 'User is not valid');
                    } else {
                        const findRefreshToken = await client.get(
                            `${decoded.uid}_refresh_token`
                        );
                        const findAccessToken = await client.get(
                            `${decoded.uid}_access_token`
                        );
                        if (token !== findAccessToken || !findAccessToken) {
                            errCode2(
                                next,
                                'Token của bạn không đúng hoặc đã hết hạn'
                            );
                        } else if (!findRefreshToken) {
                            errCode2(next, 'Token is not valid or expired');
                        } else if (token == findRefreshToken) {
                            res.locals.user = userFindById;
                            next();
                        } else {
                            res.locals.user = userFindById;
                            next();
                        }
                    }
                }
            }
        );
    } catch (error: any) {
        errCode1(next, error);
    }
};

const verifyPermission = (permissions: Array<string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user: userType = res.locals.user;
        const rule = user.payment.rule;
        if (permissions.includes(rule)) {
            next();
        } else {
            errCode2(next, `You don't have permission to access this api !!`);
        }
    };
};

export { verifyToken, verifyPermission };
