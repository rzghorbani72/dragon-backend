const {port, env} = require('./src/config/vars');
const logger = require('./src/config/logger');
const app = require('./src/config/express');

// const db = require("./src/models")
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
//db.sequelize.sync({});
//b.sequelize.drop({ force: true });


app.listen(port, () => logger.info(`server started on port ${port} (${env})`));
module.exports = app;
