const mongodb = require("mongodb");
const { lcConfigCollectionDouble } = require("./configDb.double");
const { CONFIGDB_URL } = require("../../config");
const { logEmitter } = require("../../services/logging.service");

let client = undefined;
let configDB = undefined;

let allLcConfigData;

const establishConnectionToMongo = async (collectionName) => {
  if (process.env.DOUBLE_MODE === "true") {
    logEmitter.emit(
      "doubleMode",
      "configDb.connector",
      "establishConnectionToMongo"
    );
    return lcConfigCollectionDouble;
  } else {
    if (configDB === undefined) {
      client = await mongodb.MongoClient.connect(CONFIGDB_URL, {
        useNewUrlParser: true
      });
      configDB = client.db("register_a_food_business_config");
    }
    return configDB.collection(collectionName);
  }
};

const connectToConfigDb = async () => {
  if (process.env.DOUBLE_MODE === "true") {
    logEmitter.emit(
      "doubleMode",
      "configDb.connector",
      "establishConnectionToMongo"
    );
    return lcConfigCollectionDouble;
  } else {
    if (configDB === undefined) {
      client = await mongodb.MongoClient.connect(CONFIGDB_URL, {
        useNewUrlParser: true
      });
      configDB = client.db("register_a_food_business_config");
    }
    return configDB;
  }
};

const disconnectConfigDb = async () => {
  if (client) {
    client.close();
  }
};

const ConfigVersionCollection = async (database) =>
  await database.collection("configVersion");
const LocalCouncilConfigDbCollection = async (database) =>
  await database.collection("lcConfig");
const SupplierConfigDbCollection = async (database) =>
  await database.collection("supplierConfig");

const getConfigVersion = async (regDataVersion) => {
  logEmitter.emit("functionCall", "configDb.connector", "getConfigVersion");

  try {
    const configVersionCollection = await establishConnectionToMongo(
      "configVersion"
    );
    const configVersionData = await configVersionCollection.findOne({
      _id: regDataVersion
    });
    logEmitter.emit(
      "functionSuccess",
      "configDB.connector",
      "getConfigVersion"
    );
    return configVersionData;
  } catch (err) {
    const newError = new Error();
    newError.name = "mongoConnectionError";
    newError.message = err.message;

    logEmitter.emit(
      "functionFail",
      "configDb.connector",
      "getConfigVersion",
      newError
    );

    throw newError;
  }
};

const findCouncilById = async (collection, id) => {
  return await collection.findOne({
    _id: id
  });
};

const findCouncilByUrl = async (collection, url) => {
  return await collection.findOne({
    local_council_url: url
  });
};

const getAllLocalCouncilConfig = async () => {
  logEmitter.emit(
    "functionCall",
    "configDb.connector",
    "getAllLocalCouncilConfig"
  );

  try {
    const lcConfigCollection = await establishConnectionToMongo("lcConfig");
    const allLcConfigDataCursor = await lcConfigCollection.find({});
    allLcConfigData = allLcConfigDataCursor.toArray();
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "configDb.connector",
      "getAllLocalCouncilConfig",
      err
    );

    const newError = new Error();
    newError.name = "mongoConnectionError";
    newError.message = err.message;

    throw newError;
  }

  logEmitter.emit(
    "functionSuccess",
    "configDb.connector",
    "getAllLocalCouncilConfig"
  );

  return allLcConfigData;
};

const clearMongoConnection = () => {
  client = undefined;
  configDB = undefined;
};

const addDeletedId = async (id) => {
  const deletedIdsCollection = await establishConnectionToMongo("deletedIds");

  return deletedIdsCollection.insertOne({ id: id });
};

const getCouncilsForSupplier = async (url) => {
  logEmitter.emit(
    "functionCall",
    "configDb.connector",
    "getCouncilsForSupplier"
  );

  let councils = [];

  try {
    const supplierConfigCollection = await establishConnectionToMongo(
      "supplierConfig"
    );
    const supplierConfig = await supplierConfigCollection.findOne({
      supplier_url: url
    });
    councils = supplierConfig ? supplierConfig.local_council_urls : [];
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "configDb.connector",
      "getCouncilsForSupplier",
      err
    );

    const newError = new Error();
    newError.name = "mongoConnectionError";
    newError.message = err.message;

    throw newError;
  }

  logEmitter.emit(
    "functionSuccess",
    "configDb.connector",
    "getCouncilsForSupplier"
  );

  return councils;
};

module.exports = {
  mongodb,
  establishConnectionToMongo,
  connectToConfigDb,
  disconnectConfigDb,
  LocalCouncilConfigDbCollection,
  SupplierConfigDbCollection,
  ConfigVersionCollection,
  getAllLocalCouncilConfig,
  clearMongoConnection,
  addDeletedId,
  getConfigVersion,
  findCouncilByUrl,
  findCouncilById,
  getCouncilsForSupplier
};