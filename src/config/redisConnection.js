import redisObject from "redis";
import bluebird from "bluebird";
import variables from "./vars.js";

let con;

bluebird.promisifyAll(redisObject.RedisClient.prototype);
bluebird.promisifyAll(redisObject.Multi.prototype);

export const createConnection = () => {
  const redis = redisObject.createClient(
    variables.REDIS.PORT,
    variables.REDIS.HOST
  );
  if (process.env.REDIS_PASSWORD) {
    redis.auth(process.env.REDIS_PASSWORD);
  }
  redis.on("connect", () => {
    console.log("Redis Connected");
  });
  redis.on("Error", (err) => {
    console.log(err);
  });

  return redis;
};

export const getConnection = () => {
  if (!con) {
    con = createConnection();
  }

  return con;
};
