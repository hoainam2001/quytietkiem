import { Response, Request, NextFunction } from 'express';
import {
    dataCode,
    errCode1,
    errCode2,
    formatVND,
    generatePassword,
    mail,
    precisionRound,
    restoreImageFromBase64,
    saltBcrypt,
    successCode
} from '../utils/functions.utils';

import Path from 'path';
import bcrypt from 'bcrypt';

import {
    CONTRACT_STATUS,
    DEPOSIT_STATUS,
    WITHDRAW_STATUS
} from '../types/enum';

import RateServices from '../services/rate.services';
import { UserServices } from '../services/user.services';
import DepositServices from '../services/deposit.services';
import { userType } from '../types/user.type';
import WithdrawServices from '../services/withdraw.services';
import PaymentServices from '../services/payment.services';
import ContractServices from '../services/contract.services';
import axios from 'axios';

const rate_services = new RateServices();
const user_services = new UserServices();
const deposit_services = new DepositServices();
const withdraw_services = new WithdrawServices();
const payment_services = new PaymentServices();
const contract_services = new ContractServices();

export default class AdminController {
    // [POST] /admin/addRate
    async addRate(req: Request, res: Response, next: NextFunction) {
        try {
            const { rate } = req.body;
            const rate_create = await rate_services.create_rate({ rate: rate });
            dataCode(res, rate_create);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/getRate/:id
    async getRate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const rate_create = await rate_services.get_rate_by_id(
                parseInt(id)
            );
            dataCode(res, rate_create);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/updateRate/:id
    async update_rate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { rate } = req.body;
            await rate_services.update_rate(parseInt(id), { rate: rate });
            const get_rate_new: any = await rate_services.get_rate_by_id(
                parseInt(id)
            );
            dataCode(res, get_rate_new.data);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [DELETE] /admin/deleteRate/:idRate
    async delete_rate(req: Request, res: Response, next: NextFunction) {
        try {
            const { idRate } = req.params;
            const delete_rate: any = await rate_services.delete_rate(
                parseInt(idRate)
            );
            successCode(res, delete_rate.message);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/getPayments
    async get_all_payment(req: Request, res: Response, next: NextFunction) {
        try {
            const page = req.query?.page ? req.query?.page : '1';
            const show = req.query?.show ? req.query?.show : '10';
            const step: number = precisionRound(
                (parseInt(`${page}`) - 1) * parseInt(`${show}`)
            );

            const payments: any = await payment_services
                .get_all()
                .then((data: any) => data?.data);

            const result = payments.slice(step, step + parseInt(`${show}`));

            dataCode(res, result);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/payment/:idPayment
    async get_payment_by_id(req: Request, res: Response, next: NextFunction) {
        try {
            const { idPayment } = req.params;
            const payment: any = await payment_services.find_payment_by_id(
                parseInt(idPayment)
            );
            if (!payment?.data) {
                throw Error(`Payment is not valid with id = ${idPayment}`);
            }
            dataCode(res, payment.data);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [POST] /admin/addPayment
    async add_payment(req: Request, res: Response, next: NextFunction) {
        try {
            const payments: any = await payment_services.create_payment(
                req.body
            );
            dataCode(res, payments.data);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/updatePayment/:idPayment
    async update_payment(req: Request, res: Response, next: NextFunction) {
        try {
            const { idPayment } = req.params;
            await payment_services.update_payment(
                req.body,
                parseInt(idPayment)
            );
            const get_payment: any = await payment_services.find_payment_by_id(
                parseInt(idPayment)
            );
            successCode(res, get_payment.data);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [DELETE] /admin/deletePayment/:idPayment
    async delete_payment(req: Request, res: Response, next: NextFunction) {
        try {
            const { idPayment } = req.params;
            const delete_payment: any = await payment_services.delete_payment(
                parseInt(idPayment)
            );
            successCode(res, delete_payment.message);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/allUsers
    async get_all_users(req: Request, res: Response, next: NextFunction) {
        try {
            const page = req.query?.page ? req.query?.page : '1';
            const show = req.query?.show ? req.query?.show : '10';
            const step: number = precisionRound(
                (parseInt(`${page}`) - 1) * parseInt(`${show}`)
            );
            const list_users: any = await user_services
                .get_all_user()
                .then((data: any) => data?.data);
            const result = list_users.slice(step, step + parseInt(`${show}`));
            dataCode(res, result);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/user/:idUser
    async get_user_by_id(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const user: any = await user_services.get_user_by_id(idUser);
            if (!user?.data) {
                throw Error(`User is not valid with id = ${idUser}`);
            }
            dataCode(res, user.data);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/updateUser/:idUser
    async update_user(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const user: any = await user_services.get_user_by_id(idUser);

            if (!user) {
                throw Error(`user is not valid with id = ${idUser}`);
            }

            const updated: any = await user_services.update_user(
                idUser,
                req.body
            );
            successCode(res, updated);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [DELETE] /admin/deleteUser/:idUser
    async delete_user(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const delete_success: any = user_services.delete_user(idUser);
            successCode(res, delete_success.message);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/deposits
    async get_all_deposit(req: Request, res: Response, next: NextFunction) {
        try {
            const page = req.query?.page ? req.query?.page : '1';
            const show = req.query?.show ? req.query?.show : '10';
            const step: number = precisionRound(
                (parseInt(`${page}`) - 1) * parseInt(`${show}`)
            );

            const deposits: Array<any> = await deposit_services
                .get_all()
                .then((deposits: any) => deposits.data);
            if (!deposits) {
                throw Error(`No deposit`);
            }
            const result = deposits.slice(step, step + parseInt(`${show}`));

            dataCode(res, {
                deposits: result,
                total: result.length,
                page: page
            });
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/deposit/idDeposit
    async get_deposit_by_id(req: Request, res: Response, next: NextFunction) {
        try {
            const { idDeposit } = req.params;
            const deposit: any = await deposit_services.find_deposit_by_id(
                parseInt(idDeposit)
            );
            if (!deposit.data) {
                throw Error(`Deposit is not valid with id = ${idDeposit}`);
            }
            dataCode(res, deposit.data);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/updateDeposit/:idDeposit
    async update_deposit(req: Request, res: Response, next: NextFunction) {
        try {
            const { idDeposit } = req.params;
            const deposit: any = await deposit_services
                .find_deposit_by_id(parseInt(idDeposit))
                .then((deposit: any) => deposit?.data);

            if (!deposit) {
                throw Error(`Deposit is not valid with id = ${idDeposit}`);
            }

            const updated: any = await deposit_services.update_deposit(
                req.body,
                parseInt(idDeposit)
            );
            successCode(res, updated);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [DELETE] /admin/deleteDeposit/:idDeposit
    async delete_deposit(req: Request, res: Response, next: NextFunction) {
        try {
            const { idDeposit } = req.params;
            const deposit: any = await deposit_services
                .find_deposit_by_id(parseInt(idDeposit))
                .then((data: any) => data?.data);
            if (!deposit) {
                throw Error(`Deposit is not valid with id = ${idDeposit}`);
            }
            const change_to_cancel: any = await axios.put(
                `${process.env.URL}/bot/handleDeposit/${idDeposit}`,
                { status: DEPOSIT_STATUS.CANCELED }
            );
            // console.log(change_to_cancel);
            if (change_to_cancel?.data?.code == 0) {
                const delete_success: any =
                    await deposit_services.delete_deposit(
                        parseInt(`${idDeposit}`)
                    );
                successCode(res, delete_success.message);
            } else {
                errCode2(next, `${change_to_cancel?.data?.message}`);
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/withdraws
    async get_all_withdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const page = req.query?.page ? req.query?.page : '1';
            const show = req.query?.show ? req.query?.show : '10';
            const step: number = precisionRound(
                (parseInt(`${page}`) - 1) * parseInt(`${show}`)
            );

            const withdraws: Array<any> = await withdraw_services
                .get_all()
                .then((withdraws: any) => withdraws.data);
            if (!withdraws) {
                throw Error(`No withdraw`);
            }
            const result = withdraws.slice(step, step + parseInt(`${show}`));

            dataCode(res, {
                withdraws: result,
                total: result.length,
                page: page
            });
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/withdraw/:idWithdraw
    async get_withdraw_by_id(req: Request, res: Response, next: NextFunction) {
        try {
            const { idWithdraw } = req.params;
            const withdraw: any = await withdraw_services
                .find_withdraw_by_id(parseInt(idWithdraw))
                .then((data: any) => data?.data);
            if (!withdraw) {
                throw Error(`Withdraw is not valid with id = ${idWithdraw}`);
            }
            dataCode(res, withdraw);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/updateWithdraw/:idWithdraw
    async update_withdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const { idWithdraw } = req.params;
            const updated_success: any =
                await withdraw_services.update_withdraw(
                    req.body,
                    parseInt(idWithdraw)
                );
            successCode(res, updated_success.message);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [DELETE] /admin/deleteWithdraw/:idWithdraw
    async delete_withdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const { idWithdraw } = req.params;
            const withdraw: any = await withdraw_services
                .find_withdraw_by_id(parseInt(idWithdraw))
                .then((data: any) => data?.data);
            if (!withdraw) {
                throw Error(`Withdraw is not valid with id = ${idWithdraw}`);
            }
            const change_to_cancel: any = await axios.put(
                `${process.env.URL}/bot/handleWithdraw/${idWithdraw}`,
                { status: WITHDRAW_STATUS.CANCELED }
            );
            if (change_to_cancel?.data?.code == 0) {
                const delete_success: any =
                    await withdraw_services.delete_withdraw(
                        parseInt(`${idWithdraw}`)
                    );
                successCode(res, delete_success.message);
            } else {
                errCode2(next, `${change_to_cancel?.data?.message}`);
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/contracts
    async get_all_contract(req: Request, res: Response, next: NextFunction) {
        try {
            // const page = req.query?.page ? req.query?.page : '1';
            // const show = req.query?.show ? req.query?.show : '10';
            // const step: number = precisionRound(
            //     (parseInt(`${page}`) - 1) * parseInt(`${show}`)
            // );
            const contracts: Array<any> = await contract_services
                .get_all_contract()
                .then((contracts: any) => contracts.data);
            if (!contracts) {
                throw Error(`No contract`);
            }
            // const result = contracts.slice(step, step + parseInt(`${show}`));

            // dataCode(res, {
            //     contracts: result,
            //     total: result.length,
            //     page: page
            // });
            dataCode(res, contracts);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    //[GET] /admin/contract/:idContract
    async get_contract_by_id(req: Request, res: Response, next: NextFunction) {
        try {
            const { idContract } = req.params;
            const contract: any = await contract_services
                .get_contract_by_id(parseInt(idContract))
                .then((data: any) => data?.data);
            if (!contract) {
                throw Error(`contract is not valid with id = ${idContract}`);
            }
            dataCode(res, contract);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/contract/:idContract
    async update_contract(req: Request, res: Response, next: NextFunction) {
        try {
            const { idContract } = req.params;
            const updated_success: any =
                await contract_services.update_contract(
                    parseInt(idContract),
                    req.body
                );
            successCode(res, updated_success.message);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/addImageContract/:idContract
    async add_image_contract(req: Request, res: Response, next: NextFunction) {
        try {
            const { idContract } = req.params;
            const { image, imageName } = req.body;
            const date = Date.now();
            const contract: any = await contract_services
                .get_contract_by_id(parseInt(idContract))
                .then((result: any) => result?.data);

            if (!contract) {
                throw Error(`No contract with id = ${idContract}`);
            }

            const name_file = `${date}-${imageName}`;
            await restoreImageFromBase64(image, name_file, 'images');
            const pathImageContract = Path.join('/images', name_file);
            const updated_success: any =
                await contract_services.update_contract(parseInt(idContract), {
                    statement: pathImageContract
                });
            successCode(
                res,
                `Add image for contract successfully. ${updated_success.message}`
            );
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [DELETE] /admin/contract/:idContract
    async delete_contract(req: Request, res: Response, next: NextFunction) {
        try {
            const { idContract } = req.params;
            const change_to_cancel: any = await axios.put(
                `${process.env.URL}/bot/handleContract/${idContract}`,
                { status: CONTRACT_STATUS.CANCELED }
            );
            if (change_to_cancel?.data?.code == 0) {
                const delete_success: any =
                    await contract_services.delete_contract_by_id(
                        parseInt(`${idContract}`)
                    );
                successCode(res, delete_success.message);
            } else {
                errCode2(next, `${change_to_cancel?.data?.message}`);
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // ---------------------------- TOTAL ----------------------------

    // [GET] /admin/total/deposit
    async total_deposit(req: Request, res: Response, next: NextFunction) {
        try {
            const deposits = await deposit_services
                .get_all()
                .then((data: any) => data?.data);
            let sum = 0;
            // console.log(deposits);
            for (let index = 0; index < deposits.length; index++) {
                const element: any = deposits[index];
                const user: any = await user_services
                    .get_user_by_id(element.userId)
                    .then((data: any) => data?.data);
                if (user) {
                    if (!(user.rank === 'DEMO')) {
                        sum += element.amount;
                    }
                }
            }
            dataCode(res, {
                sum: sum,
                deposits
            });
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/total/withdraw
    async total_withdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const withdraw = await withdraw_services
                .get_all()
                .then((data: any) => data?.data);
            let sum = 0;
            for (let index = 0; index < withdraw.length; index++) {
                const element: any = withdraw[index];
                const user: any = await user_services
                    .get_user_by_id(element.userId)
                    .then((data: any) => data?.data);
                if (!(user.rank === 'DEMO')) {
                    sum += element.amount;
                }
            }
            dataCode(res, {
                sum: sum,
                withdraw
            });
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/total/balance
    async total_balance(req: Request, res: Response, next: NextFunction) {
        try {
            const users: any = await user_services
                .get_all_user()
                .then((data: any) => data?.data);
            let sum = 0;
            for (let index = 0; index < users.length; index++) {
                const element = users[index];
                if (!(element.rank === 'DEMO')) {
                    sum += element.Wallet.balance;
                }
            }
            dataCode(res, {
                sum: formatVND(sum),
                users
            });
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [GET] /admin/total/user/isBalance
    async total_user_have_balance(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const users: Array<any> = await user_services
                .get_all_user()
                .then((data: any) => data?.data);
            const filter_user = users.filter(
                (user: any) => !(user.rank === 'DEMO')
            );
            dataCode(res, filter_user);
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // ---------------------------- HANDLE_EVENT ----------------------------

    // [PUT] /admin/handleDeposit/:idDeposit
    async handle_deposit_v1(req: Request, res: Response, next: NextFunction) {
        try {
            const { idDeposit } = req.params;
            const { status } = req.body;

            const find_deposit: any = await deposit_services.find_deposit_by_id(
                parseInt(idDeposit)
            );
            if (!find_deposit.data) {
                throw Error(`Deposit is not valid with id = ${idDeposit}`);
            }
            const deposit: any = find_deposit.data;
            const idUser = deposit.userId;
            const userFind: any = await user_services.get_user_by_id(idUser);
            if (!userFind.data) {
                throw Error(`User is not valid with id = ${idUser}`);
            }
            const user: userType = userFind.data;
            if (status === DEPOSIT_STATUS.COMPLETED) {
                if (deposit.status === DEPOSIT_STATUS.PENDING) {
                    const amount = parseFloat(deposit.amount);
                    const balance = user.Wallet.balance;
                    const calculate_add = precisionRound(amount + balance);
                    const data_change = {
                        'Wallet.balance': calculate_add,
                        'Wallet.deposit': precisionRound(
                            amount + user.Wallet.deposit
                        )
                    };
                    user_services
                        .update_user(idUser, data_change)
                        .then(() => {
                            deposit_services
                                .update_deposit(
                                    { status: DEPOSIT_STATUS.COMPLETED },
                                    parseInt(idDeposit)
                                )
                                .then(async () => {
                                    const get_user_final =
                                        await user_services.get_user_by_id(
                                            idUser
                                        );
                                    dataCode(res, get_user_final);
                                })
                                .catch((err) => errCode1(next, err));
                        })
                        .catch((err) => errCode1(next, err));
                } else {
                    errCode2(
                        next,
                        `Deposit is not valid with id = ${idDeposit} for action = ${DEPOSIT_STATUS.COMPLETED}`
                    );
                }
            } else if (status === DEPOSIT_STATUS.CANCELED) {
                if (deposit.status === DEPOSIT_STATUS.COMPLETED) {
                    const amount = parseFloat(deposit.amount);
                    const balance = user.Wallet.balance;
                    const calculate_sub = precisionRound(balance - amount);
                    if (calculate_sub < 0) {
                        throw Error(
                            `Balance of user is not enough with want to sub is ${amount} and own is ${balance}`
                        );
                    }
                    const data_change = {
                        'Wallet.balance': calculate_sub,
                        'Wallet.deposit': precisionRound(
                            user.Wallet.deposit - amount
                        )
                    };
                    user_services
                        .update_user(idUser, data_change)
                        .then(() => {
                            deposit_services
                                .update_deposit(
                                    {
                                        status: DEPOSIT_STATUS.CANCELED,
                                        note: `Canceled this deposit with status = ${DEPOSIT_STATUS.COMPLETED}`
                                    },
                                    parseInt(idDeposit)
                                )
                                .then(async () => {
                                    const get_user_final =
                                        await user_services.get_user_by_id(
                                            idUser
                                        );
                                    dataCode(res, get_user_final);
                                })
                                .catch((err) => errCode1(next, err));
                        })
                        .catch((err) => errCode1(next, err));
                } else if (deposit.status === DEPOSIT_STATUS.PENDING) {
                    deposit_services
                        .update_deposit(
                            {
                                status: DEPOSIT_STATUS.CANCELED,
                                note: `Canceled this deposit with status = ${DEPOSIT_STATUS.PENDING}`
                            },
                            parseInt(idDeposit)
                        )
                        .then(async (depositAfterUpdate: any) => {
                            successCode(
                                res,
                                `${depositAfterUpdate.message} to action ${DEPOSIT_STATUS.CANCELED}`
                            );
                        })
                        .catch((err) => errCode1(next, err));
                } else {
                    errCode2(
                        next,
                        `Deposit is not valid with id = ${idDeposit} for action = ${DEPOSIT_STATUS.CANCELED}`
                    );
                }
            } else if (status === DEPOSIT_STATUS.PENDING) {
                if (deposit.status === DEPOSIT_STATUS.CANCELED) {
                    deposit_services
                        .update_deposit(
                            { status: DEPOSIT_STATUS.PENDING, note: '' },
                            parseInt(idDeposit)
                        )
                        .then(async (depositAfterUpdate: any) => {
                            successCode(
                                res,
                                `${depositAfterUpdate.message} to action ${DEPOSIT_STATUS.PENDING}`
                            );
                        })
                        .catch((err) => errCode1(next, err));
                } else {
                    errCode2(
                        next,
                        `Deposit is not valid with id = ${idDeposit} for action = ${DEPOSIT_STATUS.PENDING}`
                    );
                }
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/handleWithdraw/:idWithdraw
    async handle_withdraw_v1(req: Request, res: Response, next: NextFunction) {
        try {
            const { idWithdraw } = req.params;
            const { status } = req.body;

            const find_withdraw: any =
                await withdraw_services.find_withdraw_by_id(
                    parseInt(idWithdraw)
                );
            if (!find_withdraw.data) {
                throw Error(`Deposit is not valid with id = ${idWithdraw}`);
            }
            const withdraw: any = find_withdraw.data;
            const idUser = withdraw.userId;
            const userFind: any = await user_services.get_user_by_id(idUser);
            if (!userFind.data) {
                throw Error(`User is not valid with id = ${idUser}`);
            }
            const user: userType = userFind.data;
            if (status === WITHDRAW_STATUS.CONFIRMED) {
                if (withdraw.status === DEPOSIT_STATUS.PENDING) {
                    const amount = parseFloat(withdraw.amount);
                    const balance = user.Wallet.balance;
                    const calculate_sub = precisionRound(balance - amount);
                    if (calculate_sub < 0) {
                        throw Error(
                            `Balance of user is not enough with want to sub is ${amount} and own is ${balance}`
                        );
                    }
                    const data_change = {
                        'Wallet.balance': calculate_sub,
                        'Wallet.withdraw': precisionRound(
                            amount + user.Wallet.withdraw
                        )
                    };
                    user_services
                        .update_user(idUser, data_change)
                        .then(() => {
                            withdraw_services
                                .update_withdraw(
                                    { status: WITHDRAW_STATUS.CONFIRMED },
                                    parseInt(idWithdraw)
                                )
                                .then(async () => {
                                    const get_user_final =
                                        await user_services.get_user_by_id(
                                            idUser
                                        );
                                    dataCode(res, get_user_final);
                                })
                                .catch((err) => errCode1(next, err));
                        })
                        .catch((err) => errCode1(next, err));
                } else {
                    errCode2(
                        next,
                        `Withdraw is not valid with id = ${idWithdraw} for action = ${WITHDRAW_STATUS.CONFIRMED}`
                    );
                }
            } else if (status === WITHDRAW_STATUS.CANCELED) {
                if (
                    withdraw.status === WITHDRAW_STATUS.CONFIRMED ||
                    withdraw.status === WITHDRAW_STATUS.COMPLETED
                ) {
                    const amount = parseFloat(withdraw.amount);
                    const balance = user.Wallet.balance;
                    const calculate_add = precisionRound(balance + amount);
                    const data_change = {
                        'Wallet.balance': calculate_add,
                        'Wallet.withdraw': precisionRound(
                            user.Wallet.withdraw - amount
                        )
                    };
                    user_services
                        .update_user(idUser, data_change)
                        .then(() => {
                            withdraw_services
                                .update_withdraw(
                                    {
                                        status: WITHDRAW_STATUS.CANCELED,
                                        note: `Canceled this withdraw with status = ${withdraw.status}`
                                    },
                                    parseInt(idWithdraw)
                                )
                                .then(async () => {
                                    const get_user_final =
                                        await user_services.get_user_by_id(
                                            idUser
                                        );
                                    dataCode(res, get_user_final);
                                })
                                .catch((err) => errCode1(next, err));
                        })
                        .catch((err) => errCode1(next, err));
                } else if (withdraw.status === WITHDRAW_STATUS.PENDING) {
                    withdraw_services
                        .update_withdraw(
                            {
                                status: WITHDRAW_STATUS.CANCELED,
                                note: `Canceled this withdraw with status = ${WITHDRAW_STATUS.PENDING}`
                            },
                            parseInt(idWithdraw)
                        )
                        .then(async (withdrawAfterUpdate: any) => {
                            successCode(
                                res,
                                `${withdrawAfterUpdate.message} to action ${WITHDRAW_STATUS.CANCELED}`
                            );
                        })
                        .catch((err) => errCode1(next, err));
                } else {
                    errCode2(
                        next,
                        `Withdraw is not valid with id = ${idWithdraw} for action = ${WITHDRAW_STATUS.CANCELED}`
                    );
                }
            } else if (status === WITHDRAW_STATUS.PENDING) {
                if (withdraw.status === WITHDRAW_STATUS.CANCELED) {
                    withdraw_services
                        .update_withdraw(
                            { status: WITHDRAW_STATUS.PENDING, note: '' },
                            parseInt(idWithdraw)
                        )
                        .then(async (withdrawAfterUpdate: any) => {
                            successCode(
                                res,
                                `${withdrawAfterUpdate.message} to action ${WITHDRAW_STATUS.PENDING}`
                            );
                        })
                        .catch((err) => errCode1(next, err));
                } else {
                    errCode2(
                        next,
                        `Withdraw is not valid with id = ${idWithdraw} for action = ${WITHDRAW_STATUS.PENDING}`
                    );
                }
            } else if (status === WITHDRAW_STATUS.COMPLETED) {
                if (withdraw.status === WITHDRAW_STATUS.CONFIRMED) {
                    withdraw_services
                        .update_withdraw(
                            { status: WITHDRAW_STATUS.COMPLETED },
                            parseInt(idWithdraw)
                        )
                        .then(async (withdrawAfterUpdate: any) => {
                            const get_user_final =
                                await user_services.get_user_by_id(idUser);
                            dataCode(res, get_user_final);
                        })
                        .catch((err) => errCode1(next, err));
                } else {
                    errCode2(
                        next,
                        `Withdraw is not valid with id = ${idWithdraw} for action = ${WITHDRAW_STATUS.PENDING}`
                    );
                }
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/handleContract/:idContract
    async handle_contract_v1(req: Request, res: Response, next: NextFunction) {
        try {
            const { idContract } = req.params;
            const { status } = req.body;

            const contract: any = await contract_services
                .get_contract_by_id(parseInt(idContract))
                .then((contract: any) => contract.data?.dataValues);

            if (!contract) {
                throw Error(`Contract is not valid with id = ${idContract}`);
            }

            const user: any = await user_services
                .get_user_by_id(contract.userId)
                .then((user: any) => user.data);

            if (!user) {
                throw Error(`User is not valid with id = ${contract.userId}`);
            }

            const balance_user: number = parseFloat(user.Wallet.balance);

            if (status === CONTRACT_STATUS.CONFIRMED) {
                if (contract.status === CONTRACT_STATUS.PENDING) {
                    const balance_after = precisionRound(
                        balance_user - parseFloat(contract.principal)
                    );
                    if (balance_after < 0) {
                        throw Error(
                            `Balance of user now is not enough for this contract with balance is ${formatVND(
                                balance_user
                            )} and contract is ${formatVND(contract.principal)}`
                        );
                    }
                    const update_user: any = await user_services.update_user(
                        user._id,
                        { 'Wallet.balance': balance_after }
                    );
                    successCode(res, update_user.message);
                    const calculate_day: number =
                        contract.number_of_days_taken === 0
                            ? parseFloat(contract.number_of_days_taken) + 1
                            : contract.number_of_days_taken;
                    const calculate_interest_rate: number =
                        contract.interest_rate === 0
                            ? precisionRound(
                                  parseFloat(contract.principal) *
                                      precisionRound(
                                          (parseFloat(contract.rate) /
                                              parseFloat(contract.cycle)) *
                                              calculate_day
                                      )
                              )
                            : contract.interest_rate;
                    const input_update_contract = {
                        interest_rate: parseFloat(`${calculate_interest_rate}`),
                        number_of_days_taken: parseInt(`${calculate_day}`),
                        status: CONTRACT_STATUS.CONFIRMED
                    };
                    await contract_services.update_contract(
                        parseInt(contract.id),
                        input_update_contract
                    );
                } else {
                    errCode2(
                        next,
                        `Contract is not enough condition for action ${CONTRACT_STATUS.CONFIRMED}. Pls ${CONTRACT_STATUS.PENDING} first`
                    );
                }
            } else if (status === CONTRACT_STATUS.CANCELED) {
                if (contract.status === CONTRACT_STATUS.CONFIRMED) {
                    const input_update_contract = {
                        status: CONTRACT_STATUS.CANCELED
                    };

                    await contract_services.update_contract(
                        parseInt(contract.id),
                        input_update_contract
                    );
                    const balance_after = precisionRound(
                        balance_user + parseFloat(contract.principal)
                    );

                    const update_user: any = await user_services.update_user(
                        user._id,
                        { 'Wallet.balance': balance_after }
                    );
                    successCode(res, update_user.message);
                } else if (contract.status === CONTRACT_STATUS.COMPLETED) {
                    const input_update_contract = {
                        status: CONTRACT_STATUS.CANCELED
                    };

                    await contract_services.update_contract(
                        parseInt(contract.id),
                        input_update_contract
                    );
                    const balance_after = precisionRound(
                        balance_user - parseFloat(contract.interest_rate)
                    );

                    if (balance_after < 0) {
                        errCode2(
                            next,
                            `Can not cancel this contract because user is not enough balance with own is ${user.Wallet.balance} and want to sub is ${contract.interest_rate}`
                        );
                    } else {
                        const update_user: any =
                            await user_services.update_user(user._id, {
                                'Wallet.balance': balance_after
                            });
                        successCode(res, update_user.message);
                    }
                } else {
                    errCode2(
                        next,
                        `Contract is not enough condition for action ${CONTRACT_STATUS.CANCELED}`
                    );
                }
            } else if (status === CONTRACT_STATUS.COMPLETED) {
                if (contract.status === CONTRACT_STATUS.CONFIRMED) {
                    const input_update_contract = {
                        status: CONTRACT_STATUS.COMPLETED
                    };

                    await contract_services.update_contract(
                        parseInt(contract.id),
                        input_update_contract
                    );

                    const balance_after = precisionRound(
                        balance_user +
                            parseFloat(contract.principal) +
                            parseFloat(contract.interest_rate)
                    );
                    const update_user: any = await user_services.update_user(
                        user._id,
                        { 'Wallet.balance': balance_after }
                    );
                    successCode(res, update_user.message);
                } else {
                    errCode2(
                        next,
                        `Contract is not enough condition to ${CONTRACT_STATUS.PENDING}. PLS ${CONTRACT_STATUS.CONFIRMED} first`
                    );
                }
            } else if (status === CONTRACT_STATUS.PENDING) {
                if (contract.status === CONTRACT_STATUS.CANCELED) {
                    const input_update_contract = {
                        status: CONTRACT_STATUS.PENDING
                    };

                    await contract_services.update_contract(
                        parseInt(contract.id),
                        input_update_contract
                    );
                    successCode(res, `Changed to ${CONTRACT_STATUS.PENDING}`);
                } else {
                    errCode2(
                        next,
                        `Contract is not enough condition to ${CONTRACT_STATUS.PENDING}. PLS ${CONTRACT_STATUS.CANCELED} first`
                    );
                }
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // ---------------------------- USER SERVICES ----------------------------

    // [PUT] /admin/user/block/:email
    async handle_block_user(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.params;
            const user: any = await user_services
                .get_user_by_email(email)
                .then((data: any) => data?.data);
            if (!user) {
                throw Error(`User is not valid with email = ${email}`);
            }
            const lock_user_status = user.blockUser;
            if (!lock_user_status === true) {
                const lock_user: any = user_services
                    .update_user(user._id, {
                        blockUser: !lock_user_status
                    })
                    .then((data: any) => data?.data);
                successCode(
                    res,
                    `Lock user successfully. ${lock_user.message}`
                );
            } else {
                const lock_user: any = user_services
                    .update_user(user._id, {
                        blockUser: !lock_user_status
                    })
                    .then((data: any) => data?.data);
                successCode(
                    res,
                    `Unlock user successfully. ${lock_user.message}`
                );
            }
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/password/refresh/:idUser
    async refresh_password(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const user: any = await user_services
                .get_user_by_id(idUser)
                .then((data: any) => data?.data);

            if (!user) {
                throw Error(`User is not valid with id = ${idUser}`);
            }

            const random_password = await generatePassword(10);
            bcrypt
                .hash(random_password, saltBcrypt)
                .then(async (hashed) => {
                    if (!hashed) {
                        throw new Error(`Hash password is not success`);
                    }
                    mail(
                        user.payment.email,
                        `This is your new password: ${random_password}`,
                        'Refresh password'
                    )
                        .then()
                        .catch((err) => {
                            throw new Error(`${err.message}`);
                        });
                    await user_services.update_user(idUser, {
                        'payment.password': hashed
                    });
                    dataCode(res, `Refresh password successfully`);
                })
                .catch((err) => {
                    throw new Error(`${err.message}`);
                });
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/password/change/:idUser
    async change_password(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const { password } = req.body;
            const user: any = await user_services
                .get_user_by_id(idUser)
                .then((data: any) => data?.data);

            if (!user) {
                throw Error(`User is not valid with id = ${idUser}`);
            }

            const hashed = await bcrypt.hash(password, saltBcrypt);
            if (!hashed) {
                throw Error(`Hashed password is broken`);
            }

            await user_services.update_user(idUser, {
                'payment.password': hashed
            });
            dataCode(res, `Change password for user successfully`);
            mail(
                user.payment.email,
                `This is your new password: ${password}`,
                'Change new password by admin'
            );
        } catch (error: any) {
            errCode1(next, error);
        }
    }

    // [PUT] /admin/rule/change/:idUser
    async change_rule(req: Request, res: Response, next: NextFunction) {
        try {
            const { idUser } = req.params;
            const { rule } = req.body;
            const user: any = await user_services
                .get_user_by_id(idUser)
                .then((data: any) => data?.data);

            if (!user) {
                throw new Error(`User is not valid with id = ${idUser}`);
            }

            const updated: any = await user_services.update_user(idUser, {
                'payment.rule': rule
            });
            dataCode(res, `Change rule successfully. ${updated.message}`);
        } catch (error: any) {
            errCode1(next, error);
        }
    }
}
