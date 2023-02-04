import Rate from '../models/rate.model';

export default class RateServices {
    create_rate(data: any) {
        return new Promise((resolve, reject) => {
            Rate.create(data)
                .then((rate) =>
                    resolve({
                        code: 0,
                        message: 'Create rate successfully',
                        data: rate
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in create rate. ${err.message}`
                    })
                );
        });
    }

    update_rate(id: number, data: any) {
        return new Promise((resolve, reject) => {
            Rate.update(data, { where: { id: id } })
                .then((rate) =>
                    resolve({
                        code: 0,
                        message: 'update rate successfully'
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in update rate. ${err.message}`
                    })
                );
        });
    }

    get_rate_by_id(id: number) {
        return new Promise((resolve, reject) => {
            Rate.findByPk(id)
                .then((rate) =>
                    resolve({
                        code: 0,
                        message: 'get rate successfully',
                        data: rate
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get rate. ${err.message}`
                    })
                );
        });
    }

    delete_rate(id: number) {
        return new Promise((resolve, reject) => {
            Rate.destroy({ where: { id: id } })
                .then(() => {
                    resolve({
                        code: 0,
                        message: `Delete rate successfully with id = ${id}`
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in delete rate with id = ${id}`
                    })
                );
        });
    }
}
