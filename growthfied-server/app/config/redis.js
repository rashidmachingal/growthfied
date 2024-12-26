const Redis = require('ioredis');
const redis = new Redis();

redis.on('connect', () => {
    console.log('connected to redis successfully', process.pid);
});

redis.on('error', (error) => {
    console.log('Error to connect redis', error);
});


module.exports = redis;