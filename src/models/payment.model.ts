import { DataTypes } from 'sequelize';
import sequelizeConnection from '../databases/init.sequelize';
import Deposit from './deposit.model';
import Withdraw from './withdraw.model';

const Payment = sequelizeConnection.define(
    'payment',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type_payment: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user'
        },
        bank_name: DataTypes.STRING,
        account_name: DataTypes.STRING,
        account_number: DataTypes.STRING
    },
    {
        freezeTableName: true,
        timestamps: true,
        underscored: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['id']
            }
        ]
    }
);

export default Payment;
