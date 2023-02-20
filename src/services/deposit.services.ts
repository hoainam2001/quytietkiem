/* eslint-disable no-async-promise-executor */
import Deposit from '../models/deposit.model';
import Payment from '../models/payment.model';

class DepositServices {
    create_deposit(data: any, idPayment: number) {
        return new Promise(async (resolve, reject) => {
            const payment: any = await Payment.findByPk(idPayment);
            payment
                .createDeposit(data)
                .then(async (deposit: any) => {
                    resolve({
                        code: 0,
                        message: `Create deposit successfully`,
                        data: deposit
                    });
                })
                .catch((err: any) =>
                    reject({
                        code: 1,
                        message: `Failed in create deposit. ${err.message}`
                    })
                );
        });
    }

    update_deposit(data: any, idDeposit: number) {
        return new Promise((resolve, reject) => {
            Deposit.update(data, { where: { id: idDeposit } })
                .then(() => {
                    resolve({
                        code: 0,
                        message: `Update deposit successfully`
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in update deposit. ${err.message}`
                    })
                );
        });
    }

    find_deposit_by_id(id: number) {
        return new Promise((resolve, reject) => {
            Deposit.findByPk(id)
                .then((deposit: any) =>
                    resolve({
                        code: 0,
                        message: `Find deposit successfully with id = ${id}`,
                        data: deposit?.dataValues
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in find deposit by id. ${err.message}`
                    })
                );
        });
    }

    get_all() {
        return new Promise((resolve, reject) => {
            Deposit.findAll()
                .then((deposits) =>
                    resolve({
                        code: 0,
                        message: `Get all deposits successfully`,
                        data: deposits
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get all deposits. ${err.message}`
                    })
                );
        });
    }

    get_deposit_by_id_user(idUser: string) {
        return new Promise((resolve, reject) => {
            Deposit.findAll({ where: { userId: idUser } })
                .then((deposits) =>
                    resolve({
                        code: 0,
                        message: `Get all deposits successfully`,
                        data: deposits
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get all deposits. ${err.message}`
                    })
                );
        });
    }

    delete_deposit(id: number) {
        return new Promise((resolve, reject) => {
            Deposit.destroy({ where: { id: id } })
                .then(() => {
                    resolve({
                        code: 0,
                        message: `Delete deposit successfully with id = ${id}`
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in delete deposit with id = ${id}`
                    })
                );
        });
    }
}

export default DepositServices;
