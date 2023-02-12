import { DataTypes } from 'sequelize';
import sequelizeConnection from '../databases/init.sequelize';
import Payment from './payment.model';

const Withdraw = sequelizeConnection.define(
    'withdraw',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: DataTypes.STRING,
        status: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Canceled'),
        note: DataTypes.STRING,
        amount: DataTypes.FLOAT
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

export default Withdraw;
