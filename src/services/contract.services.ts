import Contract from '../models/contract.model';

export default class ContractServices {
    create_contract(data: any) {
        return new Promise((resolve, reject) => {
            Contract.create(data)
                .then((contract) =>
                    resolve({
                        code: 0,
                        message: 'Create contract successfully',
                        data: contract
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in create a contract. ${err.message}`
                    })
                );
        });
    }

    update_contract(id: number, data: any) {
        return new Promise((resolve, reject) => {
            Contract.update(data, { where: { id: id } })
                .then(() =>
                    resolve({
                        code: 0,
                        message: `Update contract successfully with id = ${id}`
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in update contract. ${err.message}`
                    })
                );
        });
    }

    get_all_contract() {
        return new Promise((resolve, reject) => {
            Contract.findAll()
                .then((contracts) => {
                    resolve({
                        code: 0,
                        message: 'Get all contract successfully',
                        data: contracts
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get all contracts. ${err.message}`
                    })
                );
        });
    }

    get_all_contract_belong_to_user(id: string) {
        return new Promise((resolve, reject) => {
            Contract.findAll({ where: { userId: id } })
                .then((contracts) =>
                    resolve({
                        code: 0,
                        message: `Get all contracts successfully with id user = ${id}`,
                        data: contracts
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get all contract with id user = ${id}. ${err.message}`
                    })
                );
        });
    }

    get_contract_by_id(id: number) {
        return new Promise((resolve, reject) => {
            Contract.findByPk(id)
                .then((contract) =>
                    resolve({
                        code: 0,
                        message: `Get contract by id = ${id} successfully`,
                        data: contract
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get contract by id = ${id}. ${err.message}`
                    })
                );
        });
    }

    delete_contract_by_id(id: number) {
        return new Promise((resolve, reject) => {
            Contract.destroy({ where: { id: id } })
                .then(() =>
                    resolve({
                        code: 0,
                        message: `Delete contract successfully with id = ${id}`
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in delete contract with id = ${id}. ${err.message}`
                    })
                );
        });
    }

    get_all_contract_by_status(status: string) {
        return new Promise((resolve, reject) => {
            Contract.findAll({ where: { status: status } })
                .then((contracts) => {
                    resolve({
                        code: 0,
                        message: 'Get all contract  by status successfully',
                        data: contracts
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get all contracts. ${err.message}`
                    })
                );
        });
    }
}
