import path from "path";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import swaggerJSDoc from "swagger-jsdoc";
import cookieParser from "cookie-parser";
import sessions from "express-session";

import routes from "../routes/v1/index.js";
import variables from "./vars.js";
import { converter, notFound, handler } from "../middlewares/error.js";
const __dirname = path.resolve(path.dirname(""));

/**
 * Express instance
 * @public
 */
const app = express();
const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(
  sessions({
    secret: "CJ#y)vwSUjd'd?htQcn!^o/g,#'M#}",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(cookieParser());
app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());
app.options("*", cors());
app.use(morgan(variables.logs));

// parse body params and attache them to req.body

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
    description: "dragon frontend API", // Description (optional)
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
  apis: ["./routes/v1/*.js"],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// gzip compression

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
