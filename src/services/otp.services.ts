/* eslint-disable no-async-promise-executor */
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

    delete_otp_withdraw(idServices: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const otps: Array<any> = await OTP.find({
                    idServices: idServices
                });
                if (otps.length > 0) {
                    otps.forEach(async (otp: any) => {
                        await OTP.findByIdAndDelete(otp._id);
                    });
                    resolve({ code: 0, message: 'Delete successfully' });
                }
                resolve({ code: 0, message: 'Delete successfully' });
            } catch (error: any) {
                reject({
                    code: 1,
                    message: `Delete failed in delete_otp_withdraw. ${error.message}`
                });
            }
        });
    }
}

export { OtpServices };
