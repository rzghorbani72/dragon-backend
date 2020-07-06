const redisObject = require('redis');
const bluebird = require('bluebird');
const { REDIS } = require('./vars');

let con;

bluebird.promisifyAll(redisObject.RedisClient.prototype);
bluebird.promisifyAll(redisObject.Multi.prototype);

const createConnection = () => {
  const redis = redisObject.createClient(REDIS.PORT, REDIS.HOST);
  if (process.env.REDIS_PASSWORD) { redis.auth(process.env.REDIS_PASSWORD); }
  redis.on('connect', () => {
    console.log('Redis Connected');
  });
  redis.on('Error', (err) => {
    console.log(err);
  });

  return redis;
};

module.exports.createConnection = createConnection;

module.exports.getConnection = () => {
  if (!con) { con = createConnection(); }

  return con;
};
