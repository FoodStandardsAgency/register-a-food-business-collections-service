const db = require("./models");
const logger = require("winston");

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
  Declaration: db.declaration,
  Operator: db.operator,
  Partner: db.partner,
  Premise: db.premise,
  Registration: db.registration,
  Council: db.council,
  db,
  connectToDb,
  closeConnection
};
