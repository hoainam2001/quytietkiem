import express from 'express';
const routerAdmin = express.Router();

import AdminController from '../controllers/admin.controller';

const controller = new AdminController();

// [POST] /admin/addRate
routerAdmin.post('/addRate', controller.addRate);

// [GET] /admin/getRate/:id
routerAdmin.get('/getRate/:id', controller.getRate);

// [PUT] /admin/updateRate/:id
routerAdmin.put('/updateRate/:id', controller.update_rate);

// [DELETE] /admin/deleteRate/:idRate
routerAdmin.delete('/deleteRate/:idRate', controller.delete_rate);

// [GET] /admin/allUsers
routerAdmin.get('/allUsers', controller.get_all_users);

// [PUT] /admin/handleDeposit/:idDeposit
routerAdmin.put('/handleDeposit/:idDeposit', controller.handle_deposit_v1);

// [PUT] /admin/handleWithdraw/:idWithdraw
routerAdmin.put('/handleWithdraw/:idWithdraw', controller.handle_withdraw_v1);

// [GET] /admin/getPayments
routerAdmin.get('/getPayments', controller.get_all_payment);

// [POST] /admin/addPayment
routerAdmin.post('/addPayment', controller.add_payment);

// [PUT] /admin/updatePayment/:id
routerAdmin.put('/updatePayment/:idPayment', controller.update_payment);

// [DELETE] /admin/deletePayment/:idPayment
routerAdmin.delete('/deletePayment/:idPayment', controller.delete_payment);

// [PUT] /admin/handleContract/:idContract
routerAdmin.put('/handleContract/:idContract', controller.handle_contract_v1);

// [GET] /admin/deposits
routerAdmin.get('/deposits', controller.get_all_deposit);

// [PUT] /admin/updateDeposit/:idDeposit
routerAdmin.put('/updateDeposit/:idDeposit', controller.update_deposit);

export default routerAdmin;
