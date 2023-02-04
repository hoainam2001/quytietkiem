import Payment from '../models/payment.model';

export default class PaymentServices {
    create_payment(data: any) {
        return new Promise((resolve, reject) => {
            Payment.create(data)
                .then((payment) =>
                    resolve({
                        code: 0,
                        message: `Create payment successfully`,
                        data: payment
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in create payment. ${err.message}`
                    })
                );
        });
    }

    update_payment(data: any, idPayment: number) {
        return new Promise((resolve, reject) => {
            Payment.update(data, { where: { id: idPayment } })
                .then((payment: any) =>
                    resolve({
                        code: 0,
                        message: `Update payment successfully`
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in update payment. ${err.message}`
                    })
                );
        });
    }

    find_payment_by_id(id: number) {
        return new Promise((resolve, reject) => {
            Payment.findByPk(id)
                .then((payment: any) =>
                    resolve({
                        code: 0,
                        message: `Find payment successfully with id = ${id}`,
                        data: payment
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in find payment by id. ${err.message}`
                    })
                );
        });
    }

    get_all() {
        return new Promise((resolve, reject) => {
            Payment.findAll()
                .then((payments) =>
                    resolve({
                        code: 0,
                        message: `Get all payments successfully`,
                        data: payments
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get all payments. ${err.message}`
                    })
                );
        });
    }

    delete_payment(id: number) {
        return new Promise((resolve, reject) => {
            Payment.destroy({ where: { id: id } })
                .then(() => {
                    resolve({
                        code: 0,
                        message: `Delete payment successfully with id = ${id}`
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in delete payment with id = ${id}`
                    })
                );
        });
    }
}
