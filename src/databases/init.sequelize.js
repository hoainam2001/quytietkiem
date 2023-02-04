"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var dbName = process.env.DB_NAME;
var dbUser = process.env.DB_USER;
var dbHost = process.env.DB_HOST;
var dbDriver = process.env.DB_DRIVER;
var dbPassword = process.env.DB_PASSWORD;
var sequelizeConnection = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
    port: 3306,
    pool: {
        max: 30,
        min: 5,
        acquire: 60000,
        idle: 10000
    },
    logging: false
});
sequelizeConnection
    .authenticate()
    .then(function () {
    console.log("Connected to mysql successfully");
})["catch"](function (err) { return console.log(err); });
exports["default"] = sequelizeConnection;
