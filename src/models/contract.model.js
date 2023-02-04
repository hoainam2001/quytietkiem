"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var init_sequelize_1 = require("../databases/init.sequelize");
var Contract = init_sequelize_1["default"].define('contract', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: sequelize_1.DataTypes.STRING,
    status: sequelize_1.DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Canceled'),
    rate: sequelize_1.DataTypes.FLOAT,
    principal: sequelize_1.DataTypes.FLOAT,
    interest_rate: sequelize_1.DataTypes.FLOAT,
    cycle: sequelize_1.DataTypes.ENUM('30', '90', '180', '360', '540'),
    number_of_days_taken: sequelize_1.DataTypes.INTEGER
}, {
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
});
Contract.sync();
exports["default"] = Contract;
