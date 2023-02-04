import { DataTypes } from 'sequelize';
import sequelizeConnection from '../databases/init.sequelize';

const Rate = sequelizeConnection.define(
    'Rate',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rate: DataTypes.FLOAT
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

Rate.sync();

export default Rate;
