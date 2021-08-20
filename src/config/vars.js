import path from "path";

const __dirname = path.resolve();
//import .env variables
import dotEnv from "dotenv-safe";
dotEnv.config({
  path: path.join(__dirname, ".env"),
  sample: path.join(__dirname, ".env.example"),
});

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  pgsql: {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    uri:
      process.env.NODE_ENV === "test"
        ? process.env.DB_URI_TESTS
        : process.env.DB_URI,
  },
  logs: process.env.NODE_ENV === "production" ? "combined" : "development",
  imagePath: process.env.IMAGE_PATH,
  imageBaseUrl: process.env.IMAGE_BASE_URL,
  apiAddress: process.env.API_ADDRESS,
  emailReset: {
    emailResetExpiration: process.env.EMAIL_RESET_EXPIRATION_SECONDS,
  },
  mailTrapIo: {
    host: process.env.MAILER_HOST,
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
    port: process.env.MAILER_PORT,
  },
  mailJet: {
    publicKey: process.env.MJ_APIKEY_PUBLIC,
    privateKey: process.env.MJ_APIKEY_PRIVATE,
  },
  MAIL_CHIMP_API_KEY: process.env.MAIL_CHIMP_API_KEY,
  MAIL_CHIMP_MAIN_LIST: process.env.MAIL_CHIMP_MAIN_LIST,
};
