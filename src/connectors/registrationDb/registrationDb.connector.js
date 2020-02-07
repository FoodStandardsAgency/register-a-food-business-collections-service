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

const { Op } = require("sequelize");

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

const getRegistrationTable = async (before, after) => {
  logEmitter.emit(
    "functionCall",
    "registration.connector.js",
    "getRegistrationTable"
  );
  try {
    const response = await Registration.findAll({
      where: {
        createdAt: {
          [Op.lt]: before,
          [Op.gte]: after
        }
      }
    });
    logEmitter.emit(
      "functionSuccess",
      "registration.connector.js",
      "getRegistrationTable"
    );
    return response;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registration.connector.js",
      "getRegistrationTable",
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

  let operatorNew = Object.assign(operator.dataValues);
  operatorNew.operator_first_line = operatorNew.operator_address_line_1;
  operatorNew.operator_street = operatorNew.operator_address_line_2;
  operatorNew.operator_dependent_locality = operatorNew.operator_address_line_3;

  let premiseNew = Object.assign(premise.dataValues);
  premiseNew.establishment_first_line = premiseNew.establishment_address_line_1;
  premiseNew.establishment_street = premiseNew.establishment_address_line_2;
  premiseNew.establishment_dependent_locality =
    premiseNew.establishment_address_line_3;

  //make sure value are assigned correctly from address line 1 to first_line

  return Object.assign(
    establishment.dataValues,
    { operator: operatorNew },
    { activities: activities.dataValues },
    { premise: premiseNew }
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

const getUnifiedRegistrations = async (
  registrationsBefore,
  registrationsAfter,
  fields
) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.connector",
    "getUnifiedRegistrations"
  );

  await connectToDb();

  const registrations = await getRegistrationTable(
    registrationsBefore,
    registrationsAfter
  );

  const registrationPromises = [];
  registrations.forEach(registration => {
    registrationPromises.push(getFullRegistration(registration, fields));
  });
  const fullRegistrations = await Promise.all(registrationPromises);

  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.connector",
    "getUnifiedRegistrations"
  );
  return fullRegistrations;
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

const updateRegistrationCollectedByCouncil = async (
  fsa_rn,
  collected,
  council
) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.connector",
    "updateRegistrationCollectedByCouncil"
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
      "updateRegistrationCollectedByCouncil",
      error
    );
    throw error;
  }
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.connector",
    "updateRegistrationCollectedByCouncil"
  );
  return { fsa_rn, collected };
};

module.exports = {
  getUnifiedRegistrations,
  getAllRegistrationsByCouncil,
  getSingleRegistration,
  updateRegistrationCollectedByCouncil
};
