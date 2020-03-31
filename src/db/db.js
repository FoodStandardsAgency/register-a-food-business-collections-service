const { createLogger } = require("../services/logger");
const db = require("./models");

const logger = createLogger(process.env.LOG_LEVEL);

const connectToDb = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info("Connection to postgres db has been established successfully.");
  } catch (err) {
    logger.info(`Unable to connect to the database: ${err}`);
  }
};

const closeConnection = async () => {
  return db.sequelize.close();
};

module.exports = {
  Activities: db.activities,
  Establishment: db.establishment,
  Metadata: db.metadata,
  Operator: db.operator,
  Partner: db.partner,
  Premise: db.premise,
  Registration: db.registration,
  Council: db.council,
  db,
  connectToDb,
  closeConnection
};
