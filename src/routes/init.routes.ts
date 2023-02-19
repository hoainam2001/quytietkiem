import { Express, NextFunction, Request, Response } from 'express';
import { router as AuthenticationRouter } from './authentication.routes';
import { router as UserRouter } from '../routes/user.routes';
import routerAdmin from './admin.routes';
import routerBot from './bot.routes';

import { LoggerErr } from '../utils/logger';
const LogErr = new LoggerErr('Error');
const loggerError: any = LogErr.createLogger();

const LogWarn = new LoggerErr('Warning');
const loggerWarn: any = LogWarn.createLogger();

const initRoutes = (app: Express) => {
    // routes
    app.use('/authentication', AuthenticationRouter);
    app.use('/users', UserRouter);
    app.use('/admin', routerAdmin);
    app.use('/bot', routerBot);

    app.use('/', (req: Request, res: Response, next: NextFunction) => {
        res.send('Welcome to api of quy tiet kiem');
    });

    // error handle
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (err.code == 500) {
            loggerError.error(err);
            res.status(200).json({
                code: err.code,
                message: err.message
                    ? err.message
                    : 'Something error. Please contact to admin to fix this.'
            });
            // process.exit(500);
        } else {
            loggerWarn.warn(err);
            res.json({
                code: err.code,
                message: err.message
            });
        }
    });
};

export { initRoutes };
