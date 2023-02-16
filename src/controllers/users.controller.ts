import { Response, Request, NextFunction } from 'express';
import {
    dataCode,
    errCode1,
    errCode2,
    formatVND,
    mail,
    precisionRound,
    restoreImageFromBase64,
    successCode
} from '../utils/functions.utils';
import { saltBcrypt } from '../utils/functions.utils';
import bcrypt from 'bcrypt';
import Path from 'path';
import axios from 'axios';

// services
import { UserServices } from '../services/user.services';
import { OtpServices } from '../services/otp.services';
import DepositServices from '../services/deposit.services';
import WithdrawServices from '../services/withdraw.services';
import PaymentServices from '../services/payment.services';
import ContractServices from '../services/contract.services';
import DEPOSIT_TYPE from '../types/deposit.type';
import PAYMENT_TYPE from '../types/payment.type';
import CONTRACT_TYPE from '../types/contract.type';
import { CONTRACT_ENUM, CONTRACT_STATUS } from '../types/enum';
import { userType } from '../types/user.type';
import WITHDRAW_TYPE from '../types/withdraw.type';
import BotTelegramServices from '../services/bot.services';
import bot from '../databases/init.bot';
import { userModel } from '../models/user.model';

const user_services = new UserServices();
const otp_services = new OtpServices();
const deposit_services = new DepositServices();
const withdraw_services = new WithdrawServices();
const payment_services = new PaymentServices();
const contract_services = new ContractServices();
const bot_services = new BotTelegramServices();

class UserController {
    // [POST] /users/otpForGot/:code
    async otp_verification_forgot_password(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { code } = req.params;
            const check_otp_forgot: any = await otp_services.check_otp(code);
            if (
                check_otp_forgot.code === 0 &&
                check_otp_forgot?.data !== null
            ) {
                const data: any = check_otp_forgot.data;
                const password_random = Math.random().toString(36).slice(-8);
                bcrypt
                    .hash(password_random, saltBcrypt)
                    .then(async (hashed) => {
                        const update_password: any =
                            await user_services.update_user(data.idUser, {
                                'payment.password': hashed
                            });
                        if (update_password.code === 0) {
                            dataCode(res, { new_pass: password_random });
                        } else {
                            errCode2(next, update_password.message);
                        }
                    })
                    .catch((err) => errCode1(next, err));
            } else {
                errCode2(
                    next,
                    `Something error when check otp code. Please contact to admin to fix them. ${check_otp_forgot.message}`
                );
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [POST] /users/forgotPassword/:email
    async forgot_password(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.params;
            const user: any = await userModel.findOne({
                'payment.email': email
            });
            if (!user) {
                errCode2(next, `User is not valid with email = ${email}`);
            } else {
                const code = Math.floor(1000 + Math.random() * 9000);
                otp_services
                    .create_otp(user._id, code, 'forgot_pass', '')
                    .then((result: any) => {
                        mail(
                            email,
                            `Your otp is ${result.data.code}`,
                            'OTP Forgot Password'
                        )
                            .then(() => {
                                successCode(
                                    res,
                                    `Send otp for forgot password successfully`
                                );
                            })
                            .catch((err) => console.log(err.message));
                    })
                    .catch((err) => errCode2(next, err.message));
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [POST] /users/deposits/:idUser
    async deposit(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const payment_find: any = await payment_services.find_payment_by_id(
                req.body?.idPayment
            );
            // console.log(payment_find);
            if (payment_find.data === null) {
                errCode2(
                    next,
                    `Payment is not valid with id = ${req.body?.idPayment}`
                );
            } else {
                const data_input: DEPOSIT_TYPE = {
                    userId: idUser,
                    status: req.body.status,
                    statement: '',
                    note: req.body?.note,
                    amount: parseFloat(req.body?.amount)
                };
                const create_deposit: any =
                    await deposit_services.create_deposit(
                        data_input,
                        parseInt(req.body?.idPayment)
                    );
                dataCode(res, create_deposit.data);
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /users/additionImageDeposit/:idDeposit
    async addition_image(req: Request, res: Response, next: NextFunction) {
        try {
            const { idDeposit } = req.params;
            const { image, imageName } = req.body;
            const date = Date.now();
            const deposit_find: any = await deposit_services
                .find_deposit_by_id(parseInt(idDeposit))
                .then((result: any) => result?.data);
            if (!deposit_find) {
                errCode2(next, 'Deposit is not valid');
            }

            const name_file = `${date}-${imageName}`;
            await restoreImageFromBase64(image, name_file, 'images');
            const pathImageDeposit = Path.join('/images', name_file);
            const update_deposit: any = await deposit_services.update_deposit(
                { statement: pathImageDeposit },
                parseInt(idDeposit)
            );
            const get_payment: any = await payment_services
                .find_payment_by_id(parseInt(deposit_find?.paymentId))
                .then((data: any) => data.data);
            const user: any = await user_services
                .get_user_by_id(deposit_find?.userId)
                .then((result: any) => result?.data);
            bot_services.send_message_add_deposit(
                bot,
                deposit_find,
                get_payment,
                user,
                parseInt(`${process.env.CHATID_TELEGRAM_DEV}`),
                `${process.env.URL_WEB}${pathImageDeposit}`
            );
            // console.log(`${process.env.URL_WEB}${pathImageDeposit}`);
            successCode(res, update_deposit.message);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /users/deposits/:idUser
    async get_all_deposit(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const deposits: any = await deposit_services.get_deposit_by_id_user(
                idUser
            );
            dataCode(res, deposits.data);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [POST] /users/withdraw/:idUser
    async withdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const check_user_valid: any = await user_services.get_user_by_id(
                idUser
            );
            if (check_user_valid.data === null) {
                errCode2(next, `User is not valid with id = ${idUser}`);
            } else {
                const balance_user: number = parseFloat(
                    check_user_valid.data.Wallet.balance
                );
                const amount_withdraw: number = parseFloat(req.body?.amount);
                if (balance_user - amount_withdraw < 0) {
                    errCode2(
                        next,
                        `Amount of balance is not enough with own is ${balance_user} and withdraw is ${amount_withdraw}`
                    );
                } else {
                    const payment_find: any =
                        await payment_services.find_payment_by_id(
                            req.body?.idPayment
                        );
                    if (payment_find.data === null) {
                        errCode2(
                            next,
                            `Payment is not valid with id = ${req.body?.idPayment}`
                        );
                    } else {
                        const withdraw_input: WITHDRAW_TYPE = {
                            userId: idUser,
                            status: req.body.status,
                            note: req.body?.note,
                            amount: parseFloat(req.body?.amount)
                        };
                        const create_withdraw: any =
                            await withdraw_services.create_withdraw(
                                withdraw_input,
                                parseInt(req.body?.idPayment)
                            );
                        const code = Math.floor(1000 + Math.random() * 9000);
                        otp_services
                            .create_otp(
                                check_user_valid.data._id,
                                code,
                                'otp_withdraw',
                                create_withdraw.data.id.toString()
                            )
                            .then((result: any) => {
                                mail(
                                    check_user_valid.data.payment.email,
                                    `Your otp withdraw is ${result.data.code}`,
                                    'OTP withdraw'
                                )
                                    .then(() => {
                                        console.log('Sent email');
                                    })
                                    .catch((err) => errCode1(next, err));
                                dataCode(res, create_withdraw.data);
                            })
                            .catch((err) => errCode1(next, err));
                    }
                }
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /users/enterOtpWithdraw/:code
    async enter_otp_withdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const { code } = req.params;
            const check_otp_forgot: any = await otp_services.check_otp(code);
            if (check_otp_forgot.code === 0) {
                if (!check_otp_forgot?.data) {
                    throw Error('OTP is not true');
                }
                const data: any = check_otp_forgot.data;
                const idUser = data.idUser;
                const idWithdraw = data.idServices;
                const check_user_valid: any =
                    await user_services.get_user_by_id(idUser);
                const withdraw: any =
                    await withdraw_services.find_withdraw_by_id(
                        parseFloat(idWithdraw)
                    );
                if (!check_user_valid.data) {
                    throw Error(`User is not valid with id = ${idUser}`);
                }
                // console.log(withdraw);
                if (!withdraw.data) {
                    throw Error(
                        `Withdraw is not valid with id = ${idWithdraw}`
                    );
                }

                axios
                    .put(
                        `${process.env.URL}/admin/handleWithdraw/${idWithdraw}`,
                        {
                            status: 'Confirmed'
                        }
                    )
                    .then(async (result) => {
                        dataCode(res, result.data);
                        const get_payment: any = await payment_services
                            .find_payment_by_id(
                                parseInt(withdraw?.data?.paymentId)
                            )
                            .then((data: any) => data.data);
                        const user: any = await user_services
                            .get_user_by_id(withdraw?.data?.userId)
                            .then((result: any) => result?.data);
                        bot_services.send_message_add_withdraw(
                            bot,
                            withdraw?.data,
                            get_payment,
                            user,
                            parseInt(`${process.env.CHATID_TELEGRAM_DEV}`)
                        );
                    })
                    .catch((err) => errCode1(next, err));
            } else {
                errCode2(
                    next,
                    `Something error when check otp code. Please contact to admin to fix them. ${check_otp_forgot.message}`
                );
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /users/withdraws/:idUser
    async get_all_withdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const withdraws: any =
                await withdraw_services.get_withdraws_by_id_user(idUser);
            dataCode(res, withdraws.data);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /users/addPayment/:idUser
    async addPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const { bankName, name, account } = req.body;
            const check_user_valid: any = user_services.get_user_by_id(idUser);
            if (check_user_valid.data === null) {
                errCode2(next, `User is not valid with id = ${idUser}`);
            } else {
                const data_input: PAYMENT_TYPE = {
                    bank_name: bankName,
                    account_name: name,
                    account_number: account,
                    type_payment: 'user'
                };
                await payment_services.create_payment(data_input);
                const add_payment: any = await user_services.add_payment(
                    idUser,
                    {
                        bankName: bankName,
                        name: name,
                        account: account
                    }
                );

                successCode(res, add_payment.message);
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [POST] /users/addContract/:idUser
    async add_contract(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const input_data: CONTRACT_TYPE = {
                userId: idUser,
                status: CONTRACT_STATUS.PENDING,
                rate: 0.06,
                principal: req.body?.principal.toString(),
                interest_rate: 0,
                cycle: (parseInt(req.body?.cycle) * 30).toString(),
                number_of_days_taken: 0,
                type: req.body?.type,
                statement: '',
                date_start: req.body.day
            };

            contract_services
                .create_contract(input_data)
                .then((contract: any) => contract.data)
                .then(async (contract: any) => {
                    const id = contract.id;
                    const userFind: any = await user_services.get_user_by_id(
                        idUser
                    );
                    const user: userType = userFind.data;
                    const otp = Math.floor(1000 + Math.random() * 9000);
                    await otp_services.create_otp(idUser, otp, 'contract', id);
                    await mail(
                        user.payment.email,
                        `Your otp is ${otp}`,
                        'Create a contract'
                    );
                    dataCode(res, contract);
                })
                .catch((err) => errCode1(next, err));
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /users/disbursement/:idContract
    async get_disbursement(req: Request, res: Response, next: NextFunction) {
        try {
            const { idContract } = req.params;
            const contract: any = await contract_services
                .get_contract_by_id(parseInt(idContract))
                .then((result: any) => result?.data);

            if (!contract) {
                throw Error(`No contract with id = ${idContract}`);
            }
            const cycle_for_months = parseInt(contract.cycle) / 30;
            const principal = parseInt(contract.principal);

            if (contract.type === CONTRACT_ENUM.USD) {
                let LT = 0.7;
                if (principal < 25000000) {
                    if (cycle_for_months < 3) {
                        LT = LT + 0;
                    } else if (cycle_for_months < 6 && cycle_for_months >= 3) {
                        LT = LT + 0.1;
                    } else if (cycle_for_months < 9 && cycle_for_months >= 6) {
                        LT = LT + 0.2;
                    } else if (cycle_for_months < 12 && cycle_for_months >= 9) {
                        LT = LT + 0.3;
                    } else if (
                        cycle_for_months < 18 &&
                        cycle_for_months >= 12
                    ) {
                        LT = LT + 0.4;
                    } else {
                        LT = LT + 0.5;
                    }
                } else if (principal >= 25000000 && principal < 200000000) {
                    if (cycle_for_months < 3) {
                        LT = LT + 0.1;
                    } else if (cycle_for_months < 6 && cycle_for_months >= 3) {
                        LT = LT + 0.1 + 0.1;
                    } else if (cycle_for_months < 9 && cycle_for_months >= 6) {
                        LT = LT + 0.2 + 0.1;
                    } else if (cycle_for_months < 12 && cycle_for_months >= 9) {
                        LT = LT + 0.3 + 0.1;
                    } else if (
                        cycle_for_months < 18 &&
                        cycle_for_months >= 12
                    ) {
                        LT = LT + 0.4 + 0.1;
                    } else {
                        LT = LT + 0.5 + 0.1;
                    }
                } else if (principal >= 200000000 && principal < 500000000) {
                    if (cycle_for_months < 3) {
                        LT = LT + 0.2;
                    } else if (cycle_for_months < 6 && cycle_for_months >= 3) {
                        LT = LT + 0.1 + 0.2;
                    } else if (cycle_for_months < 9 && cycle_for_months >= 6) {
                        LT = LT + 0.2 + 0.2;
                    } else if (cycle_for_months < 12 && cycle_for_months >= 9) {
                        LT = LT + 0.3 + 0.2;
                    } else if (
                        cycle_for_months < 18 &&
                        cycle_for_months >= 12
                    ) {
                        LT = LT + 0.4 + 0.2;
                    } else {
                        LT = LT + 0.5 + 0.2;
                    }
                } else if (principal >= 500000000 && principal < 1000000000) {
                    if (cycle_for_months < 3) {
                        LT = LT + 0.3;
                    } else if (cycle_for_months < 6 && cycle_for_months >= 3) {
                        LT = LT + 0.1 + 0.3;
                    } else if (cycle_for_months < 9 && cycle_for_months >= 6) {
                        LT = LT + 0.2 + 0.3;
                    } else if (cycle_for_months < 12 && cycle_for_months >= 9) {
                        LT = LT + 0.3 + 0.3;
                    } else if (
                        cycle_for_months < 18 &&
                        cycle_for_months >= 12
                    ) {
                        LT = LT + 0.4 + 0.3;
                    } else {
                        LT = LT + 0.5 + 0.3;
                    }
                } else if (principal >= 1000000000 && principal < 5000000000) {
                    if (cycle_for_months < 3) {
                        LT = LT + 0.4;
                    } else if (cycle_for_months < 6 && cycle_for_months >= 3) {
                        LT = LT + 0.1 + 0.4;
                    } else if (cycle_for_months < 9 && cycle_for_months >= 6) {
                        LT = LT + 0.2 + 0.4;
                    } else if (cycle_for_months < 12 && cycle_for_months >= 9) {
                        LT = LT + 0.3 + 0.4;
                    } else if (
                        cycle_for_months < 18 &&
                        cycle_for_months >= 12
                    ) {
                        LT = LT + 0.4 + 0.4;
                    } else {
                        LT = LT + 0.5 + 0.4;
                    }
                } else {
                    if (cycle_for_months < 3) {
                        LT = LT + 0.5;
                    } else if (cycle_for_months < 6 && cycle_for_months >= 3) {
                        LT = LT + 0.1 + 0.5;
                    } else if (cycle_for_months < 9 && cycle_for_months >= 6) {
                        LT = LT + 0.2 + 0.5;
                    } else if (cycle_for_months < 12 && cycle_for_months >= 9) {
                        LT = LT + 0.3 + 0.5;
                    } else if (
                        cycle_for_months < 18 &&
                        cycle_for_months >= 12
                    ) {
                        LT = LT + 0.4 + 0.5;
                    } else {
                        LT = LT + 0.5 + 0.5;
                    }
                }
                const period_interest = precisionRound(
                    (Math.pow(1 + precisionRound(LT / 100), cycle_for_months) -
                        1) *
                        100
                ).toFixed(2); // lãi kỳ
                const disbursement = formatVND(
                    principal *
                        (precisionRound(parseFloat(period_interest) / 100) + 1)
                );
                dataCode(res, {
                    disbursement,
                    principal: formatVND(principal),
                    month_interest: LT,
                    period_interest: period_interest
                });
            } else {
                const seasons = cycle_for_months / 6;
                if (seasons < 2) {
                    throw Error(
                        `Because your season is less than 2. No disbursement.`
                    );
                }
                const disbursement = precisionRound(
                    principal *
                        seasons *
                        precisionRound((0.15 * seasons) / 2 + 1)
                );
                dataCode(res, {
                    disbursement: formatVND(disbursement)
                });
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /users/password/:idUser
    async change_pwd(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const { password, new_password } = req.body;
            const user = await user_services
                .get_user_by_id(idUser)
                .then((result: any) => result.data);
            if (!user) {
                throw Error(`User is  not valid with id = ${idUser}`);
            }
            bcrypt
                .compare(password, user.payment.password)
                .then(async (match) => {
                    if (!match) {
                        throw Error(`Password is not true`);
                    }
                    const hashed = await bcrypt.hash(new_password, saltBcrypt);
                    const update_password: any =
                        await user_services.update_user(idUser, {
                            'payment.password': hashed
                        });
                    if (update_password.code === 0) {
                        dataCode(res, { new_pass: new_password });
                    } else {
                        errCode2(next, update_password.message);
                    }
                })
                .catch((err) => errCode1(next, err));
        } catch (error: any) {
            errCode1(next, error);
        }
    }
}

export { UserController };
