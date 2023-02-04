import { Dialect, Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD;

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
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
    .then(function (this: any) {
        console.log(`Connected to mysql successfully`);
    })
    .catch((err) => console.log(err));

export default sequelizeConnection;
