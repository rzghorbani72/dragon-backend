"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConnection = exports.createConnection = void 0;

var _redis = _interopRequireDefault(require("redis"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _vars = require("./vars");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var con;

_bluebird["default"].promisifyAll(_redis["default"].RedisClient.prototype);

_bluebird["default"].promisifyAll(_redis["default"].Multi.prototype);

var createConnection = function createConnection() {
  var redis = _redis["default"].createClient(_vars.REDIS.PORT, _vars.REDIS.HOST);

  if (process.env.REDIS_PASSWORD) {
    redis.auth(process.env.REDIS_PASSWORD);
  }

  redis.on("connect", function () {
    console.log("Redis Connected");
  });
  redis.on("Error", function (err) {
    console.log(err);
  });
  return redis;
};

exports.createConnection = createConnection;

var getConnection = function getConnection() {
  if (!con) {
    con = createConnection();
  }

  return con;
};

exports.getConnection = getConnection;