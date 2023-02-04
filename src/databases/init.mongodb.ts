import mongoose, { Connection } from 'mongoose';

const { TYPE, MONGO_PRO, MONGO_DEV } = process.env;

const create_connection = (uri: string) => {
    const db: mongoose.Connection = mongoose.createConnection(uri);

    db.on('error', function (this: any, err: any) {
        console.log(
            `Mongodb :: connection ${this.name} ${JSON.stringify(err)}`
        );
        db.close().catch(() =>
            console.log(
                `Mongodb:: Failed to close connection with ${this.name}`
            )
        );
    });

    db.on('connected', function (this: any) {
        console.log(`Mongodb :: connection ${this.name}`);
    });

    db.on('disconnected', function (this: any, err: any) {
        console.log(
            `Mongodb :: connection ${this.name} ${JSON.stringify(err)}`
        );
    });

    return db;
};

let conn!: Connection;
switch (TYPE) {
    case 'product':
        // for product
        conn = create_connection(`${MONGO_PRO}`);
        break;
    case 'dev':
        // for dev
        conn = create_connection(`${MONGO_DEV}`);
        break;
}

export default conn;
