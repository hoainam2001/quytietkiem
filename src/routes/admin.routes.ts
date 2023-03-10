import express from 'express';
const routerAdmin = express.Router();

import AdminController from '../controllers/admin.controller';
import {
    check_lock,
    verifyPermission,
    verifyToken
} from '../middlewares/checkToken';

const controller = new AdminController();

// [POST] /admin/addRate
routerAdmin.post(
    '/addRate',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.addRate
);

// [GET] /admin/getRate/:id
routerAdmin.get('/getRate/:id', controller.getRate);

// [PUT] /admin/updateRate/:id
routerAdmin.put(
    '/updateRate/:id',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.update_rate
);

// [DELETE] /admin/deleteRate/:idRate
routerAdmin.delete(
    '/deleteRate/:idRate',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.delete_rate
);

// [GET] /admin/allUsers
routerAdmin.get('/allUsers', controller.get_all_users);

// [GET] /admin/user/:idUser
routerAdmin.get('/user/:idUser', controller.get_user_by_id);

// [PUT] /admin/updateUser/:idUser
routerAdmin.put(
    '/updateUser/:idUser',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.update_user
);

// [DELETE] /admin/deleteUser/:idUser
routerAdmin.delete(
    '/deleteUser/:idUser',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.delete_user
);

// [GET] /admin/getPayments
routerAdmin.get('/getPayments', controller.get_all_payment);

// [GET] /admin/payment/:idPayment
routerAdmin.get('/payment/:idPayment', controller.get_payment_by_id);

// [POST] /admin/addPayment
routerAdmin.post(
    '/addPayment',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.add_payment
);

// [PUT] /admin/updatePayment/:id
routerAdmin.put(
    '/updatePayment/:idPayment',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.update_payment
);

// [DELETE] /admin/deletePayment/:idPayment
routerAdmin.delete(
    '/deletePayment/:idPayment',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.delete_payment
);

// [GET] /admin/deposits
routerAdmin.get('/deposits', controller.get_all_deposit);

// [GET] /admin/deposit/idDeposit
routerAdmin.get('/deposit/:idDeposit', controller.get_deposit_by_id);

// [PUT] /admin/updateDeposit/:idDeposit
routerAdmin.put(
    '/updateDeposit/:idDeposit',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.update_deposit
);

// [DELETE] /admin/deleteDeposit/:idDeposit
routerAdmin.delete(
    '/deleteDeposit/:idDeposit',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.delete_deposit
);

// [GET] /admin/withdraws
routerAdmin.get('/withdraws', controller.get_all_withdraw);

// [GET] /admin/withdraw/:idWithdraw
routerAdmin.get('/withdraw/:idWithdraw', controller.get_withdraw_by_id);

// [PUT] /admin/updateWithdraw/:idWithdraw
routerAdmin.put(
    '/updateWithdraw/:idWithdraw',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.update_withdraw
);

// [DELETE] /admin/deleteWithdraw/:idWithdraw
routerAdmin.delete(
    '/deleteWithdraw/:idWithdraw',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.delete_withdraw
);

// [GET] /admin/contracts
routerAdmin.get('/contracts', controller.get_all_contract);

//[GET] /admin/contract/:idContract
routerAdmin.get('/contract/:idContract', controller.get_contract_by_id);

// [PUT] /admin/contract/:idContract
routerAdmin.put(
    '/contract/:idContract',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.update_contract
);

// [PUT] /admin/addImageContract/:idContract
routerAdmin.put(
    '/addImageContract/:idContract',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.add_image_contract
);

// [DELETE] /admin/contract/:idContract
routerAdmin.delete(
    '/contract/:idContract',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.delete_contract
);

/// ----------------------------------TOTAL ----------------------------------

// [GET] /admin/total/deposit
routerAdmin.get('/total/deposit', controller.total_deposit);

// [GET] /admin/total/withdraw
routerAdmin.get('/total/withdraw', controller.total_withdraw);

// [GET] /admin/total/balance
routerAdmin.get('/total/balance', controller.total_balance);

// [GET] /admin/total/user/isBalance
routerAdmin.get('/total/user/isBalance', controller.total_user_have_balance);

/// ----------------------------------HANDLE ----------------------------------

// [PUT] /admin/handleContract/:idContract
routerAdmin.put(
    '/handleContract/:idContract',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.handle_contract_v1
);

// [PUT] /admin/handleDeposit/:idDeposit
routerAdmin.put(
    '/handleDeposit/:idDeposit',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.handle_deposit_v1
);

// [PUT] /admin/handleWithdraw/:idWithdraw
routerAdmin.put(
    '/handleWithdraw/:idWithdraw',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.handle_withdraw_v1
);

// [PUT] /admin/user/block/:email
routerAdmin.put(
    '/user/block/:email',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.handle_block_user
);

// [PUT] /admin/password/refresh/:idUser
routerAdmin.put(
    '/password/refresh/:idUser',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.refresh_password
);

// [PUT] /admin/password/change/:idUser
routerAdmin.put(
    '/password/change/:idUser',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.change_password
);

// [PUT] /admin/rule/change/:idUser
routerAdmin.put(
    '/rule/change/:idUser',
    verifyToken,
    check_lock,
    verifyPermission(['admin']),
    controller.change_rule
);

export default routerAdmin;
