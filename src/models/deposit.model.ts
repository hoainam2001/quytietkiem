import { DataTypes } from 'sequelize';
import sequelizeConnection from '../databases/init.sequelize';
import Payment from './payment.model';

const Deposit = sequelizeConnection.define(
    'deposit',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: DataTypes.STRING,
        status: DataTypes.ENUM('Pending', 'Completed', 'Canceled'),
        method: DataTypes.STRING,
        statement: DataTypes.STRING,
        note: DataTypes.STRING,
        amount: DataTypes.FLOAT,
        idPayment: DataTypes.INTEGER
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

export default Deposit;
