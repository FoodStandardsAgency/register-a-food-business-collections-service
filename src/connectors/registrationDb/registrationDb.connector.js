const {
  Activities,
  Establishment,
  Metadata,
  Operator,
  Partner,
  Premise,
  Registration,
  connectToDb
} = require("../../db/db");
const { logEmitter } = require("../../services/logging.service");

const modelFindOne = async (query, model) => {
  try {
    return model.findOne(query);
  } catch (err) {
    err.name = "dbModelFindOneError";
    err.rawError = `Model: ${model}`;
    throw err;
  }
};

const convertJSDateToISODate = () => {
  const jsDate = new Date();
  const isoDate = jsDate.toISOString();
  return isoDate;
};

const getEstablishmentByRegId = async id => {
  return modelFindOne(
    { where: { registrationId: id } },
    Establishment,
    "getEstablishmentByRegId"
  );
};

const getMetadataByRegId = async id => {
  return modelFindOne(
    { where: { registrationId: id } },
    Metadata,
    "getMetadataByRegId"
  );
};

const getOperatorByEstablishmentId = async id => {
  return modelFindOne(
    {
      where: { establishmentId: id },
      include: [
        {
          model: Partner,
          as: "partners"
        }
      ]
    },
    Operator,
    "getOperatorByEstablishmentId"
  );
};

const getPremiseByEstablishmentId = async id => {
  return modelFindOne(
    { where: { establishmentId: id } },
    Premise,
    "getPremiseByEstablishmentId"
  );
};

const getActivitiesByEstablishmentId = async id => {
  return modelFindOne(
    { where: { establishmentId: id } },
    Activities,
    "getActivitiesByEstablishmentId"
  );
};

const getRegistrationTableByCouncil = async (council, collected) => {
  logEmitter.emit(
    "functionCall",
    "registration.connector.js",
    "getRegistrationTableByCouncil"
  );
  try {
    const response = await Registration.findAll({
      where: {
        council,
        collected
      }
    });
    logEmitter.emit(
      "functionSuccess",
      "registration.connector.js",
      "getRegistrationTableByCouncil"
    );
    return response;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registration.connector.js",
      "getRegistrationTableByCouncil",
      err
    );
    throw err;
  }
};

const getFullEstablishment = async id => {
  const establishment = await getEstablishmentByRegId(id);
  const [operator, activities, premise] = await Promise.all([
    getOperatorByEstablishmentId(establishment.id),
    getActivitiesByEstablishmentId(establishment.id),
    getPremiseByEstablishmentId(establishment.id)
  ]);
  return Object.assign(
    establishment.dataValues,
    { operator: operator.dataValues },
    { activities: activities.dataValues },
    { premise: premise.dataValues }
  );
};

const getFullMetadata = async id => {
  const metadata = await getMetadataByRegId(id);

  return metadata.dataValues;
};

const getSingleRegistration = async (fsa_rn, council) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.connector",
    "getSingleRegistration"
  );

  await connectToDb();

  const registration = await modelFindOne(
    { where: { fsa_rn, council } },
    Registration,
    "getSingleRegistration"
  );
  if (registration === null) {
    const error = new Error("getRegistrationNotFoundError");
    error.name = "getRegistrationNotFoundError";
    logEmitter.emit(
      "functionFail",
      "registrationsDb.connector",
      "getRegistrationCollected",
      error
    );
    throw error;
  }
  const fullRegistration = await getFullRegistration(registration, [
    "establishment",
    "metadata"
  ]);
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.connector",
    "getSingleRegistration"
  );
  return fullRegistration;
};

const getFullRegistration = async (registration, fields = []) => {
  const establishment = fields.includes("establishment")
    ? await getFullEstablishment(registration.id)
    : {};
  const metadata = fields.includes("metadata")
    ? await getFullMetadata(registration.id)
    : {};

  return Object.assign(
    registration.dataValues,
    { establishment },
    { metadata }
  );
};

const getAllRegistrationsByCouncil = async (
  council,
  newRegistrations,
  fields
) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.connector",
    "getAllRegistrationsByCouncil"
  );

  await connectToDb();

  const registrationPromises = [];
  // get NEW [false, null] or EVERYTHING [true, false, null]
  const queryArray = newRegistrations === "true" ? [false] : [true, false];
  const registrations = await getRegistrationTableByCouncil(
    council,
    queryArray
  );

  registrations.forEach(registration => {
    registrationPromises.push(getFullRegistration(registration, fields));
  });
  const fullRegistrations = await Promise.all(registrationPromises);
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.connector",
    "getAllRegistrationsByCouncil"
  );
  return fullRegistrations;
};

const updateRegistrationCollected = async (fsa_rn, collected, council) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.connector",
    "updateRegistrationCollected"
  );

  await connectToDb();

  const isoDate = convertJSDateToISODate();
  const response = await Registration.update(
    {
      collected,
      collected_at: isoDate
    },
    {
      where: {
        fsa_rn,
        council
      }
    }
  );

  if (response[0] === 0) {
    const error = new Error("updateRegistrationNotFoundError");
    error.name = "updateRegistrationNotFoundError";
    logEmitter.emit(
      "functionFail",
      "registrationsDb.connector",
      "updateRegistrationCollected",
      error
    );
    throw error;
  }
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.connector",
    "updateRegistrationCollected"
  );
  return { fsa_rn, collected };
};

module.exports = {
  getAllRegistrationsByCouncil,
  getSingleRegistration,
  updateRegistrationCollected
};
