import { ObjectId } from 'mongoose';
import { otpModel as OTP } from '../models/otp.model';

class OtpServices {
    create_otp(idUser: string, code: number, type: string, idServices: string) {
        return new Promise((resolve, reject) => {
            const new_otp = new OTP({
                idUser: idUser,
                code: code,
                type: type,
                idServices: idServices
            });
            new_otp
                .save()
                .then((result) => {
                    resolve({
                        code: 0,
                        message: 'Create OTP successfully',
                        data: result
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in create otp. ${err.message}`
                    })
                );
        });
    }

    check_otp(code: string) {
        return new Promise((resolve, reject) => {
            OTP.findOne({ code: code })
                .then((result) => {
                    resolve({
                        code: 0,
                        message: 'Get OTP successfully',
                        data: result
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in check otp. ${err.message}`
                    })
                );
        });
    }
}

export { OtpServices };
