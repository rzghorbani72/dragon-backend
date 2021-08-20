"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var logger = _winston["default"].createLogger({
  level: "info",
  format: _winston["default"].format.json(),
  transports: [//
  // - Write to all logs with level `info` and below to `combined.log`
  // - Write all logs error (and below) to `error.log`.
  //
  new _winston["default"].transports.File({
    filename: "error.log",
    level: "error"
  }), new _winston["default"].transports.File({
    filename: "combined.log"
  })]
}); //
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//


if (process.env.NODE_ENV !== "production") {
  logger.add(new _winston["default"].transports.Console({
    format: _winston["default"].format.combine(_winston["default"].format.colorize(), _winston["default"].format.simple())
  }));
}

logger.stream = {
  write: function write(message) {
    logger.info(message.trim());
  }
};
var _default = logger;
exports["default"] = _default;