import { DataTypes } from 'sequelize';
import sequelizeConnection from '../databases/init.sequelize';

const Contract = sequelizeConnection.define(
    'contract',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: DataTypes.STRING,
        status: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Canceled'),
        rate: DataTypes.FLOAT,
        principal: DataTypes.FLOAT,
        interest_rate: DataTypes.FLOAT,
        cycle: DataTypes.ENUM('30', '90', '180', '360', '540'),
        number_of_days_taken: DataTypes.INTEGER,
        type: DataTypes.ENUM('USD', 'AGRICULTURE')
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

Contract.sync();

export default Contract;
