const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port:5432,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
sequelize.authenticate().then(() => {
    console.log("\n *** Successful! connected to database ***\n");
}).catch((err) => {
    console.log(err);
});

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize
};
db.models ={}
// db.accessToken = require("./accessToken.model")(sequelize, Sequelize);
// db.accessVideoLimitation = require("./accessVideoLimitation.model")(sequelize, Sequelize);
// db.article = require("./article.model")(sequelize, Sequelize);
// db.cast = require("./cast.model")(sequelize, Sequelize);
// db.category = require("./category.model")(sequelize, Sequelize);
// db.companyVerification = require("./companyVerification.model")(sequelize, Sequelize);
// db.course = require("./course.model")(sequelize, Sequelize);
// db.coursePaymentVerification = require("./coursePaymentVerification.model")(sequelize, Sequelize);
// db.discount = require("./discount.model")(sequelize, Sequelize);
// db.emailVerification = require("./emailVerification.model")(sequelize, Sequelize);
db.models.image = require("./image.model")(sequelize, Sequelize);
// db.loginData = require("./loginData.model")(sequelize, Sequelize);
// db.phoneNumberVerification = require("./phoneNumberVerification.model")(sequelize, Sequelize);
// db.role = require("./role.model")(sequelize, Sequelize);
// db.subscriber = require("./subscriber.model")(sequelize, Sequelize);
// db.subscriptionPaymentVerification = require("./subscriptionPaymentVerification.model")(sequelize, Sequelize);
//db.tag = require("./tag.model")(sequelize, Sequelize);
db.models.user = require("./user.model")(sequelize, Sequelize);
db.models.tutorials = require("./tutorial.model")(sequelize, Sequelize);
// db.userSocial = require("./userSocial.model")(sequelize, Sequelize);
// db.video = require("./video.model")(sequelize, Sequelize);

Object.keys(db.models).forEach(key => {
    if ('associate' in db.models[key]) {
        db.models[key].associate(db.models);
    }
});
module.exports = db;
