"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _compression = _interopRequireDefault(require("compression"));

var _methodOverride = _interopRequireDefault(require("method-override"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _v = _interopRequireDefault(require("../routes/v1"));

var _vars = _interopRequireDefault(require("./vars"));

var _error = require("../middlewares/error");

var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Express instance
 * @public
 */
var app = (0, _express["default"])(); // request logging. dev: console | production: file

app.use((0, _morgan["default"])(_vars["default"].logs));

var _dirname = _path["default"].resolve(_path["default"].dirname("")); // parse body params and attache them to req.body


app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_express["default"]["static"](_path["default"].join(_dirname, "../public"))); // view engine setup
// app.set('views', path.join(__dirname, '../public'));

/*
app.get('/fb', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'fb_login.html'));
}); */

app.get("/", function (req, res, next) {
  res.sendFile(_path["default"].join(_dirname, "..", "public", "login.html"));
}); // Swagger definition

var swaggerDefinition = {
  info: {
    // API informations (required)
    title: "dragon",
    // Title (required)
    version: "1.0.0",
    // Version (required)
    description: "Event Master API" // Description (optional)

  },
  host: "localhost:".concat(_vars["default"].port),
  // Host (optional)
  basePath: "/" // Base path (optional)

}; // Options for the swagger docs

var options = {
  // Import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran,
  // not the application itself.
  apis: ["./src/routes/v1/*.js"]
}; // Initialize swagger-jsdoc -> returns validated swagger spec in json format

var swaggerSpec = (0, _swaggerJsdoc["default"])(options); // gzip compression

app.use((0, _compression["default"])()); // lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it

app.use((0, _methodOverride["default"])()); // secure apps by setting various HTTP headers

app.use((0, _helmet["default"])()); // enable CORS - Cross Origin Resource Sharing

app.use((0, _cors["default"])());
app.options("*", (0, _cors["default"])()); // enable authentication
// app.use(passport.initialize());
// passport.use('jwt', strategies.jwt);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);
// Serve swagger docs the way you like (Recommendation: swagger-tools)

app.get("/api-docs.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
}); // mount api v1 routes

app.use("/v1", _v["default"]); // if error is not an instanceOf APIError, convert it.

app.use(_error.converter); // catch 404 and forward to error handler

app.use(_error.notFound); // error handler, send stacktrace only during development

app.use(_error.handler);
var _default = app;
exports["default"] = _default;