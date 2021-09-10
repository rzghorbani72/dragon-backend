import variables from "./src/config/vars.js";
import logger from "./src/config/logger.js";
import app from "./src/config/express.js";
import db from "./src/models/index.js";
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
//db.sequelize.sync();
//db.sequelize.drop({ force: true });

app.listen(variables.port, () =>
  logger.info(`server started on port ${variables.port} (${variables.env})`)
);
export default app;
