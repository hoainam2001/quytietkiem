import sequelizeConnection from '../databases/init.sequelize';
import Withdraw from '../models/withdraw.model';
import Payment from '../models/payment.model';
import Deposit from '../models/deposit.model';

Payment.hasMany(Withdraw);
Payment.hasMany(Deposit);

sequelizeConnection
    .sync()
    .then(() => {
        console.log('Sync model');
    })
    .catch((err) => console.log(err));
