require("dotenv").config();
const {
  Registration,
  connectToDb,
  closeConnection,
} = require("../../src/db/db");

const clearTables = async () => {
  await connectToDb();
  await Registration.truncate({ cascade: true });
  closeConnection();
};

clearTables();
