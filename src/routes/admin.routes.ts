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

// [GET] /admin/user/:idUser
routerAdmin.get('/user/:idUser', controller.get_user_by_id);

// [PUT] /admin/updateUser/:idUser
routerAdmin.put('/updateUser/:idUser', controller.update_user);

// [DELETE] /admin/deleteUser/:idUser
routerAdmin.delete('/deleteUser/:idUser', controller.delete_user);

// [GET] /admin/getPayments
routerAdmin.get('/getPayments', controller.get_all_payment);

// [GET] /admin/payment/:idPayment
routerAdmin.get('/payment/:idPayment', controller.get_payment_by_id);

// [POST] /admin/addPayment
routerAdmin.post('/addPayment', controller.add_payment);

// [PUT] /admin/updatePayment/:id
routerAdmin.put('/updatePayment/:idPayment', controller.update_payment);

// [DELETE] /admin/deletePayment/:idPayment
routerAdmin.delete('/deletePayment/:idPayment', controller.delete_payment);

// [GET] /admin/deposits
routerAdmin.get('/deposits', controller.get_all_deposit);

// [GET] /admin/deposit/idDeposit
routerAdmin.get('/deposit/:idDeposit', controller.get_deposit_by_id);

// [PUT] /admin/updateDeposit/:idDeposit
routerAdmin.put('/updateDeposit/:idDeposit', controller.update_deposit);

// [DELETE] /admin/deleteDeposit/:idDeposit
routerAdmin.delete('/deleteDeposit/:idDeposit', controller.delete_deposit);

// [GET] /admin/withdraws
routerAdmin.get('/withdraws', controller.get_all_withdraw);

// [GET] /admin/withdraw/:idWithdraw
routerAdmin.get('/withdraw/:idWithdraw', controller.get_withdraw_by_id);

// [PUT] /admin/updateWithdraw/:idWithdraw
routerAdmin.put('/updateWithdraw/:idWithdraw', controller.update_withdraw);

// [DELETE] /admin/deleteWithdraw/:idWithdraw
routerAdmin.delete('/deleteWithdraw/:idWithdraw', controller.delete_withdraw);

/// ----------------------------------HANDLE ----------------------------------

// [PUT] /admin/handleContract/:idContract
routerAdmin.put('/handleContract/:idContract', controller.handle_contract_v1);

// [PUT] /admin/handleDeposit/:idDeposit
routerAdmin.put('/handleDeposit/:idDeposit', controller.handle_deposit_v1);

// [PUT] /admin/handleWithdraw/:idWithdraw
routerAdmin.put('/handleWithdraw/:idWithdraw', controller.handle_withdraw_v1);

export default routerAdmin;
