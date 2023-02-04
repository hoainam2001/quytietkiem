import { createClient } from 'redis';

const secret = { host: '1270.0.0.1', port: 6379, password: '' };

const redisClient = createClient(secret);

redisClient
    .connect()
    .then(() => console.log('Connected to redis successfully'))
    .catch((err) => console.log(err));

export { redisClient };
