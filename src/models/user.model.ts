import { Schema, model } from 'mongoose';
import conn from '../databases/init.mongodb';

interface IUser {
    Wallet: {
        balance: number;
        deposit: number;
        withdraw: number;
    };
    payment: {
        bank: {
            bankName: string;
            name: string;
            account: string;
        };
        private: boolean;
        rule: string;
        email: string;
        password: string;
        username: string;
    };
    contract: string[];
    rank: string;
    changeBalance: number;
    uploadCCCDFont: string;
    uploadCCCDBeside: string;
    uploadLicenseFont: string;
    uploadLicenseBeside: string;
    blockUser: boolean;
}

const user = new Schema<IUser>(
    {
        Wallet: {
            balance: { type: Number, default: 0.0 },
            deposit: { type: Number, default: 0.0 },
            withdraw: { type: Number, default: 0.0 }
        },
        payment: {
            bank: {
                bankName: { type: String, default: '' },
                name: { type: String, default: '' },
                account: { type: String, default: '' }
            },
            private: { type: Boolean, default: false },
            rule: {
                type: String,
                enum: ['user', 'admin', 'manager'],
                default: 'user'
            },
            email: {
                type: String,
                default: '',
                unique: true,
                required: true
            },
            password: { type: String, default: '', required: true },
            username: {
                type: String,
                default: '',
                required: true,
                unique: true
            }
        },
        contract: { type: [], default: [] },
        rank: { type: String, default: 'Standard' },
        changeBalance: { type: Number, default: 0.0 },
        uploadCCCDFont: { type: String, default: '' },
        uploadCCCDBeside: { type: String, default: '' },
        uploadLicenseFont: { type: String, default: '' },
        uploadLicenseBeside: { type: String, default: '' },
        blockUser: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        collection: 'users'
    }
);

const userModel = conn.model<IUser>('users', user);

export { userModel, IUser };
