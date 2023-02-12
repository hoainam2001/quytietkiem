import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import moment = require('moment');
import helmet from 'helmet';

// import crypto from 'crypto';
dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true
    })
);
app.use(express.static('uploads'));
app.use(helmet());

// console.log(crypto.randomBytes(64).toString('hex'));

import './databases/init.redis';
import './databases/init.mongodb';
import './databases/init.sequelize';
import './utils/create_folder';
import './utils/Sequelize.utils';
import './utils/auto.contract.utils';
import './bot/botTelegram';

import { initRoutes } from './routes/init.routes';
initRoutes(app);

moment.locale('vi');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Connected');
});
