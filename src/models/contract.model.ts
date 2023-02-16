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
        principal: DataTypes.FLOAT, /// tiền gốc
        interest_rate: DataTypes.FLOAT, /// tiền lãi
        cycle: DataTypes.STRING, /// chu kì gửi
        number_of_days_taken: DataTypes.INTEGER, /// số ngày đã gửi
        type: DataTypes.ENUM('USD', 'AGRICULTURE'), /// loại gửi
        statement: DataTypes.STRING, //// hình ảnh về hợp đồng
        date_start: DataTypes.DATE
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
