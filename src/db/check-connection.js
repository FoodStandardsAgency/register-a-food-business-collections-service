const { info } = require("winston");
const db = require("./models");

function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

const loop = async () => {
  try {
    await db.sequelize.authenticate();
    info("Connection to postgres db has been established successfully.");
    db.sequelize.close();
  } catch (err) {
    info("Unable to connect to the database: ", err);
    await sleep(1000);
    loop();
  }
};

loop();
