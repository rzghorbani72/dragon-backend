import dbConfig from "../config/db.config.js";
import { Sequelize } from "sequelize";
import accessToken from "./accessToken.model.js";
import category from "./category.model.js";
import emailProviderVerification from "./emailProviderVerification.model.js";
import course from "./course.model.js";
import discount from "./discount.model.js";
import file from "./file.model.js";
import phoneNumberVerification from "./phoneNumberVerification.model.js";
import user from "./user.model.js";
import order from "./order.model.js";
import payment from "./payment.model.js";
import visitedVideo from "./visitedVideo.model.js";
import likedCourses from "./likedCourses.model.js";
import courseCategory from "./courseCategory.model.js";
import variables from "../config/vars.js";
import userDiscountModel from "./userDiscount.model.js";

const dbEnv = dbConfig[variables.env];
const sequelize = new Sequelize(
  dbEnv.database,
  dbEnv.username,
  dbEnv.password,
  {
    host: dbEnv.host,
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      useUTC: true, //for reading from database
      dateStrings: true,
      typeCast: true,
    },
    timezone: "UTC", //for writing to database
    pool: {
      max: dbEnv.pool.max,
      min: dbEnv.pool.min,
      acquire: dbEnv.pool.acquire,
      idle: dbEnv.pool.idle,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("\n *** Successful! connected to database ***\n");
  })
  .catch((err) => {
    console.log("\n !?!?!? unable connecting to database !?!?!?\n");
    console.log(err);
    console.log("\n !?!?!? unable connecting to database !?!?!?n");
  });

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  models: {
    accessToken: accessToken(sequelize, Sequelize),
    category: category(sequelize, Sequelize),
    emailProviderVerification: emailProviderVerification(sequelize, Sequelize),
    course: course(sequelize, Sequelize),
    discount: discount(sequelize, Sequelize),
    file: file(sequelize, Sequelize),
    phoneNumberVerification: phoneNumberVerification(sequelize, Sequelize),
    user: user(sequelize, Sequelize),
    visitedVideo: visitedVideo(sequelize, Sequelize),
    payment: payment(sequelize, Sequelize),
    order: order(sequelize, Sequelize),
    userDiscount: userDiscountModel(sequelize, Sequelize),
    likedCourses: likedCourses(sequelize, Sequelize),
  },
};
//join tables
db.models.courseCategory = courseCategory(sequelize, Sequelize);

Object.keys(db.models).forEach((key) => {
  if ("associate" in db.models[key]) {
    db.models[key].associate(db.models);
  }
});
export default db;
