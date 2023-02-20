/* eslint-disable no-async-promise-executor */
import Payment from '../models/payment.model';
import Withdraw from '../models/withdraw.model';

class WithdrawServices {
    create_withdraw(data: any, idPayment: number) {
        return new Promise(async (resolve, reject) => {
            const payment: any = await Payment.findByPk(idPayment);
            payment
                .createWithdraw(data)
                .then((withdraw: any) =>
                    resolve({
                        code: 0,
                        message: `Create withdraw successfully`,
                        data: withdraw
                    })
                )
                .catch((err: any) =>
                    reject({
                        code: 1,
                        message: `Failed in create withdraw. ${err.message}`
                    })
                );
        });
    }

    update_withdraw(data: any, idWithdraw: number) {
        return new Promise((resolve, reject) => {
            Withdraw.update(data, { where: { id: idWithdraw } })
                .then((withdraw: any) =>
                    resolve({
                        code: 0,
                        message: `Update withdraw successfully`
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in update withdraw. ${err.message}`
                    })
                );
        });
    }

    find_withdraw_by_id(id: number) {
        return new Promise((resolve, reject) => {
            Withdraw.findByPk(id)
                .then((withdraw: any) =>
                    resolve({
                        code: 0,
                        message: `Find withdraw successfully with id = ${id}`,
                        data: withdraw?.dataValues
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in find withdraw by id. ${err.message}`
                    })
                );
        });
    }

    get_all() {
        return new Promise((resolve, reject) => {
            Withdraw.findAll()
                .then((withdraws) =>
                    resolve({
                        code: 0,
                        message: `Get all withdraws successfully`,
                        data: withdraws
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get all withdraws. ${err.message}`
                    })
                );
        });
    }

    get_withdraws_by_id_user(idUser: string) {
        return new Promise((resolve, reject) => {
            Withdraw.findAll({ where: { userId: idUser } })
                .then((withdraws) =>
                    resolve({
                        code: 0,
                        message: `Get all withdraws successfully`,
                        data: withdraws
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get all withdraws. ${err.message}`
                    })
                );
        });
    }

    delete_withdraw(id: number) {
        return new Promise((resolve, reject) => {
            Withdraw.destroy({ where: { id: id } })
                .then(() => {
                    resolve({
                        code: 0,
                        message: `Delete withdraw successfully with id = ${id}`
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in delete withdraw with id = ${id}`
                    })
                );
        });
    }
}

export default WithdrawServices;
