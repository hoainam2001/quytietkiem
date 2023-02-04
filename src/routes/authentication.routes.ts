import express from 'express';
const router = express.Router();

import { AuthenticationController } from '../controllers/authentication.controller';

const controller = new AuthenticationController();

// [POST] /authentication/register
router.post('/register', controller.register);

// [POST] /authentication/login
router.post('/login', controller.login);

// [GET] /authentication/refreshToken/:idUser
router.get('/refreshToken/:idUser', controller.refreshToken);

// [GET] /authentication/logout/:idUser
router.get('/logout/:idUser', controller.logout);

export { router };
