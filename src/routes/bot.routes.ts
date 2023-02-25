import express from 'express';
const routerBot = express.Router();

import AdminController from '../controllers/admin.controller';
const controller = new AdminController();

// [PUT] /bot/handleDeposit/:idDeposit
routerBot.put('/handleDeposit/:idDeposit', controller.handle_deposit_v1);

// [PUT] /bot/handleWithdraw/:idWithdraw
routerBot.put('/handleWithdraw/:idWithdraw', controller.handle_withdraw_v1);

// [PUT] /bot/handleContract/:idContract
routerBot.put('/handleContract/:idContract', controller.handle_contract_v1);

export default routerBot;
