import { userModel as User } from '../models/user.model';
import { userType } from '../types/user.type';

class UserServices {
    create_user(data: any) {
        return new Promise((resolve, reject) => {
            const new_user = new User({
                'payment.email': data.email,
                'payment.password': data.password,
                'payment.username': data.username
            });
            new_user
                .save()
                .then((user: userType) => {
                    resolve({
                        code: 0,
                        message: 'Create user successfully',
                        data: user
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in create user.${err.message}`
                    })
                );
        });
    }

    update_user(id: string, data: any) {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(id, { $set: data })
                .then(() =>
                    resolve({
                        code: 0,
                        message: `Update user successfully with id = ${id}`
                    })
                )
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in update user. ${err.message}`
                    })
                );
        });
    }

    get_all_user() {
        return new Promise((resolve, reject) => {
            User.find()
                .then((users: Array<userType>) => {
                    resolve({
                        code: 0,
                        message: 'Get all users successfully',
                        data: users
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed in get all users. ${err.message}`
                    })
                );
        });
    }

    get_user_by_id(id: string) {
        return new Promise((resolve, reject) => {
            User.findById(id)
                .then((user: any) => {
                    resolve({
                        code: 0,
                        message: 'Get user by id successfully',
                        data: user
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed to get user by id. ${err.message}`
                    })
                );
        });
    }

    get_user_by_email(email: string) {
        return new Promise((resolve, reject) => {
            User.findOne({ 'payment.email': email })
                .then((user: any) => {
                    resolve({
                        code: 0,
                        message: 'Get user by email successfully',
                        data: user
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed to get user by email. ${err.message}`
                    })
                );
        });
    }

    delete_user(id: string) {
        return new Promise((resolve, reject) => {
            User.findByIdAndDelete(id)
                .then(() => {
                    resolve({
                        code: 0,
                        message: `Delete user successfully with id = ${id}`
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed delete user with id = ${id}. ${err.message}`
                    })
                );
        });
    }

    add_payment(id: string, data: any) {
        return new Promise((resolve, reject) => {
            const input = {
                'payment.bank.bankName': data.bankName,
                'payment.bank.name': data.name,
                'payment.bank.account': data.account
            };
            User.findByIdAndUpdate(id, { $set: input })
                .then(() => {
                    resolve({
                        code: 0,
                        message: `Add payment to user successfully with id = ${id}`
                    });
                })
                .catch((err) =>
                    reject({
                        code: 1,
                        message: `Failed add payment to user with id = ${id}. ${err.message}`
                    })
                );
        });
    }
}

export { UserServices };
