import express from 'express';
const router = express.Router();

import multer from 'multer';
import path from 'path';

import { UserController } from '../controllers/users.controller';
import { verifyPermission, verifyToken } from '../middlewares/checkToken';

const controller = new UserController();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images_user');
    },

    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({ storage: storage });

const single = multer({ dest: 'uploads/images' });

const cpUpload = upload.fields([
    { name: 'cccdFont', maxCount: 1 },
    { name: 'cccdBeside', maxCount: 1 },
    { name: 'licenseFont', maxCount: 1 },
    { name: 'licenseBeside', maxCount: 1 }
]);

// [POST] /users/forgotPassword/:email
router.post('/forgotPassword/:email', controller.forgot_password);
// [GET] /users/otpForGot/:code
router.get('/otpForGot/:code', controller.otp_verification_forgot_password);

// [POST] /users/deposit/:idUser
router.post('/deposit/:idUser', verifyToken, controller.deposit);

// [PUT] /users/additionImageDeposit/:idDeposit
router.put(
    '/additionImageDeposit/:idDeposit',
    verifyToken,
    single.single('statement'),
    controller.addition_image
);

// [GET] /users/deposits/:idUser
router.get('/deposits/:idUser', verifyToken, controller.get_all_deposit);

// [POST] /users/withdraw/:idUser
router.post('/withdraw/:idUser', verifyToken, controller.withdraw);

// [GET] /users/enterOtpWithdraw/:code
router.get('/enterOtpWithdraw/:code', controller.enter_otp_withdraw);

// [GET] /users/withdraws/:idUser
router.get('/withdraws/:idUser', controller.get_all_withdraw);

// [POST] /users/withdraw/otp/resend/:idWithdraw
router.post('/withdraw/otp/resend/:idWithdraw', controller.resend_otp_withdraw);

// [DELETE] /users/withdraw/cancel/:idWithdraw
router.delete('/withdraw/cancel/:idWithdraw', controller.cancel_withdraw);

// [PUT] /users/addPayment/:idUser
router.put('/addPayment/:idUser', verifyToken, controller.addPayment);

// [POST] /users/addContract/:idUser
router.post('/addContract/:idUser', verifyToken, controller.add_contract);

// [GET] /users/disbursement/:idContract
router.get('/disbursement/:idContract', controller.get_disbursement);

// [GET] /users/contract/:idUser
router.get('/contract/:idUser', controller.get_contract_usd);

// [POST] /users/disbursement/field
router.post(
    '/disbursement/field',
    verifyToken,
    controller.get_disbursement_by_field
);

// [PUT] /users/password/:idUser
router.put('/password/:idUser', verifyToken, controller.change_pwd);

// [PUT] /users/image/:idUser
router.put('/image/:idUser', cpUpload, controller.upload_image);

export { router };
