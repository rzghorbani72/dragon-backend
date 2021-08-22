import path from "path";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import routes from "../routes/v1/index.js";
import variables from "./vars.js";
import { converter, notFound, handler } from "../middlewares/error.js";
import swaggerJSDoc from "swagger-jsdoc";
import cookieParser from "cookie-parser";
/**
 * Express instance
 * @public
 */
const app = express();
app.use(cookieParser());

// request logging. dev: console | production: file
app.use(morgan(variables.logs));
const __dirname = path.resolve(path.dirname(""));

// parse body params and attache them to req.body

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
// view engine setup
// app.set('views', path.join(__dirname, '../public'));
/*
app.get('/fb', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'fb_login.html'));
}); */
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});
// Swagger definition
const swaggerDefinition = {
  info: {
    // API informations (required)
    title: "dragon", // Title (required)
    version: "1.0.0", // Version (required)
    description: "Event Master API", // Description (optional)
  },
  host: `localhost:${variables.port}`, // Host (optional)
  basePath: "/", // Base path (optional)
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran,
  // not the application itself.
  apis: ["./src/routes/v1/*.js"],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.options("*", cors());

// enable authentication
// app.use(passport.initialize());
// passport.use('jwt', strategies.jwt);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// mount api v1 routes
app.use("/v1", routes);

// if error is not an instanceOf APIError, convert it.
app.use(converter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler, send stacktrace only during development
app.use(handler);

export default app;
