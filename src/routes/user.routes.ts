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

// [POST] /users/forgotPassword/:idUser
router.post(
    '/forgotPassword/:idUser',
    verifyToken,
    verifyPermission(['user']),
    controller.forgot_password
);
// [GET] /users/otpForGot/:code
router.get('/otpForGot/:code', controller.otp_verification_forgot_password);

// [POST] /users/deposit/:idUser
router.post('/deposit/:idUser', controller.deposit);

// [PUT] /users/additionImageDeposit/:idDeposit
router.put('/additionImageDeposit/:idDeposit', controller.addition_image);

// [GET] /users/deposits/:idUser
router.get('/deposits/:idUser', controller.get_all_deposit);

// [POST] /users/withdraw/:idUser
router.post('/withdraw/:idUser', controller.withdraw);

// [GET] /users/enterOtpWithdraw/:code
router.get('/enterOtpWithdraw/:code', controller.enter_otp_withdraw);

// [GET] /users/withdraws/:idUser
router.get('/withdraws/:idUser', controller.get_all_withdraw);

// [PUT] /users/addPayment/:idUser
router.put('/addPayment/:idUser', controller.addPayment);

// [POST] /users/addContract/:idUser
router.post('/addContract/:idUser', controller.add_contract);

export { router };
