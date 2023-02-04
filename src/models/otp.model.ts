import { Schema, model, PopulatedDoc } from 'mongoose';
import conn from '../databases/init.mongodb';
import { IUser } from './user.model';

interface IOTAS {
    idUser: PopulatedDoc<IUser & Document>;
    code: string;
    type: string;
    idServices: string;
}

const otp = new Schema<IOTAS>(
    {
        idUser: { type: 'ObjectId', ref: 'users' },
        code: { type: String, default: '' },
        type: {
            type: String,
            enum: ['forgot_pass', 'otp_withdraw', 'contract'],
            default: 'forgot_pass'
        },
        idServices: { type: String, default: '' }
    },
    {
        timestamps: true,
        collection: 'otp'
    }
);

otp.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const otpModel = conn.model<IOTAS>('otp', otp);

export { otpModel };
