import dbConfig from "../config/db.config.js";
import { Sequelize } from "sequelize";
import accessToken from "./accessToken.model.js";
import category from "./category.model.js";
import emailProviderVerification from "./emailProviderVerification.model.js";
import course from "./course.model.js";
import coursePaymentVerification from "./coursePaymentVerification.model.js";
import discount from "./discount.model.js";
import image from "./image.model.js";
import loginDate from "./loginData.model.js";
import phoneNumberVerification from "./phoneNumberVerification.model.js";
import role from "./role.model.js";
import user from "./user.model.js";
import video from "./video.model.js";
import courseCategory from "./courseCategory.model.js";
import videoCategory from "./videoCategory.model.js";

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      useUTC: true, //for reading from database
      dateStrings: true,
      typeCast: true,
    },
    timezone: "UTC", //for writing to database
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("\n *** Successful! connected to database ***\n");
  })
  .catch((err) => {
    console.log(err);
  });

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  models: {
    accessToken: accessToken(sequelize, Sequelize),
    category: category(sequelize, Sequelize),
    emailProviderVerification: emailProviderVerification(sequelize, Sequelize),
    course: course(sequelize, Sequelize),
    coursePaymentVerification: coursePaymentVerification(sequelize, Sequelize),
    discount: discount(sequelize, Sequelize),
    image: image(sequelize, Sequelize),
    loginData: loginDate(sequelize, Sequelize),
    phoneNumberVerification: phoneNumberVerification(sequelize, Sequelize),
    role: role(sequelize, Sequelize),
    user: user(sequelize, Sequelize),
    video: video(sequelize, Sequelize),
  },
};
//join tables
db.models.courseCategory = courseCategory(sequelize, Sequelize);
db.models.videoCategory = videoCategory(sequelize, Sequelize);

Object.keys(db.models).forEach((key) => {
  if ("associate" in db.models[key]) {
    db.models[key].associate(db.models);
  }
});
export default db;
