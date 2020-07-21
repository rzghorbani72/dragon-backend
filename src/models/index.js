const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: 5432,
    dialect: dbConfig.dialect,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    dialectOptions: {
        useUTC: true, //for reading from database
        dateStrings: true,
        typeCast: true,
    },
    timezone: 'UTC', //for writing to database
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
    sequelize: sequelize,
    models: {
        accessToken: require("./accessToken.model")(sequelize, Sequelize),
        article: require("./article.model")(sequelize, Sequelize),
        cast: require("./cast.model")(sequelize, Sequelize),
        category: require("./category.model")(sequelize, Sequelize),
        emailProviderVerification: require("./emailProviderVerification.model")(sequelize, Sequelize),
        course: require("./course.model")(sequelize, Sequelize),
        coursePaymentVerification: require("./coursePaymentVerification.model")(sequelize, Sequelize),
        discount: require("./discount.model")(sequelize, Sequelize),
        image: require("./image.model")(sequelize, Sequelize),
        loginData: require("./loginData.model")(sequelize, Sequelize),
        phoneNumberVerification: require("./phoneNumberVerification.model")(sequelize, Sequelize),
        publisher: require("./publisher.model")(sequelize, Sequelize),
        role: require("./role.model")(sequelize, Sequelize),
        subscriptionPlan: require("./subscriptionPlan.model")(sequelize, Sequelize),
        subscriptionPaymentVerification: require("./subscriptionPaymentVerification.model")(sequelize, Sequelize),
        tag: require("./tag.model")(sequelize, Sequelize),
        user: require("./user.model")(sequelize, Sequelize),
        tutorials: require("./tutorial.model")(sequelize, Sequelize),
        social: require("./social.model")(sequelize, Sequelize),
        video: require("./video.model")(sequelize, Sequelize),
    }
};
//join tables
db.models.courseCategory = require("./courseCategory.model")(sequelize, Sequelize);
db.models.videoCategory = require("./videoCategory.model")(sequelize, Sequelize);
db.models.articleCategory = require("./articleCategory.model")(sequelize, Sequelize);
db.models.videoTag = require("./videoTag.model")(sequelize, Sequelize);
db.models.articleTag = require("./articleTag.model")(sequelize, Sequelize);
db.models.userSubscription = require("./userSubscription.model")(sequelize, Sequelize);

Object.keys(db.models).forEach(key => {
    if ('associate' in db.models[key]) {
        db.models[key].associate(db.models);
    }
});
module.exports = db;
