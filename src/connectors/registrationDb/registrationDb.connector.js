const {
  Activities,
  Establishment,
  Declaration,
  Operator,
  Partner,
  Premise,
  Registration,
  Council,
  connectToDb,
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

const getEstablishmentByRegId = async (id) => {
  return modelFindOne(
    {
      where: { registrationId: id },
      attributes: { exclude: ["registrationId"] },
    },
    Establishment,
    "getEstablishmentByRegId"
  );
};

const getDeclarationByRegId = async (id) => {
  return modelFindOne(
    {
      where: { registrationId: id },
      attributes: { exclude: ["id", "registrationId"] },
    },
    Declaration,
    "getDeclarationByRegId"
  );
};

const getOperatorByEstablishmentId = async (id) => {
  return modelFindOne(
    {
      where: { establishmentId: id },
      include: [
        {
          model: Partner,
          as: "partners",
        },
      ],
      attributes: { exclude: ["id", "establishmentId"] },
    },
    Operator,
    "getOperatorByEstablishmentId"
  );
};

const getPremiseByEstablishmentId = async (id) => {
  return modelFindOne(
    {
      where: { establishmentId: id },
      attributes: { exclude: ["id", "establishmentId"] },
    },
    Premise,
    "getPremiseByEstablishmentId"
  );
};

const getActivitiesByEstablishmentId = async (id) => {
  return modelFindOne(
    {
      where: { establishmentId: id },
      attributes: { exclude: ["id", "establishmentId"] },
    },
    Activities,
    "getActivitiesByEstablishmentId"
  );
};

const getCouncilByRegCouncil = async (council) => {
  return modelFindOne(
    { where: { local_council_url: council } },
    Council,
    "getCouncilByRegCouncil"
  );
};

const getRegistrationTableByCouncil = async (
  council,
  collected,
  before,
  after
) => {
  logEmitter.emit(
    "functionCall",
    "registration.connector.js",
    "getRegistrationTableByCouncil"
  );
  try {
    const response = await Registration.findAll({
      where: {
        council,
        collected,
        createdAt: {
          [Op.lt]: before,
          [Op.gte]: after,
        },
      },
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
          [Op.gte]: after,
        },
      },
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

const getFullEstablishment = async (id) => {
  const establishment = await getEstablishmentByRegId(id);
  const [operator, activities, premise] = await Promise.all([
    getOperatorByEstablishmentId(establishment && establishment.id),
    getActivitiesByEstablishmentId(establishment && establishment.id),
    getPremiseByEstablishmentId(establishment && establishment.id),
  ]);

  let operatorNew = {};
  if (operator) {
    operatorNew = Object.assign(operator.dataValues);
    operatorNew.operator_first_line = operatorNew.operator_address_line_1;
    operatorNew.operator_street = operatorNew.operator_address_line_2;
    operatorNew.operator_dependent_locality =
      operatorNew.operator_address_line_3;
    // TODO: remove the next two lines once company house rename is finalised
    operatorNew.operator_company_house_number =
      operatorNew.operator_companies_house_number;
    delete operatorNew.operator_companies_house_number;
  }

  let premiseNew = {};
  if (premise) {
    premiseNew = Object.assign(premise.dataValues);
    premiseNew.establishment_first_line =
      premiseNew.establishment_address_line_1;
    premiseNew.establishment_street = premiseNew.establishment_address_line_2;
    premiseNew.establishment_dependent_locality =
      premiseNew.establishment_address_line_3;
  }

  return Object.assign(
    establishment ? establishment.dataValues : {},
    { operator: operatorNew },
    { activities: activities ? activities.dataValues : {} },
    { premise: premiseNew }
  );
};

const getFullDeclaration = async (id) => {
  const metadata = await getDeclarationByRegId(id);

  return metadata ? metadata.dataValues : {};
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
    "metadata",
  ]);
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.connector",
    "getSingleRegistration"
  );
  return fullRegistration;
};

const getFullRegistration = async (registration, fields = []) => {
  const { fsa_rn } = registration.dataValues;
  const {
    competent_authority_id,
    local_council_full_name,
    local_council_url,
  } = await getCouncilByRegCouncil(registration.dataValues.council);
  const {
    collected,
    collected_at,
    createdAt,
    updatedAt,
  } = registration.dataValues;
  const establishment = fields.includes("establishment")
    ? await getFullEstablishment(registration.id)
    : {};
  const metadata = fields.includes("metadata")
    ? await getFullDeclaration(registration.id)
    : {};

  delete establishment.id;

  // Assign values in consistent order
  const newRegistration = Object.assign(
    { fsa_rn },
    {
      council: local_council_full_name,
      competent_authority_id,
      local_council_url,
    },
    { collected, collected_at, createdAt, updatedAt },
    { establishment },
    { metadata }
  );

  return newRegistration;
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

  const registrationFullPromises = [];
  registrations.forEach((registration) => {
    registrationFullPromises.push(getFullRegistration(registration, fields));
  });
  const fullRegistrationsWithCouncil = await Promise.all(
    registrationFullPromises
  );

  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.connector",
    "getUnifiedRegistrations"
  );
  return fullRegistrationsWithCouncil;
};

const getAllRegistrationsByCouncil = async (
  council,
  newRegistrations,
  fields,
  before,
  after
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
    queryArray,
    before,
    after
  );

  registrations.forEach((registration) => {
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
      collected_at: isoDate,
    },
    {
      where: {
        fsa_rn,
        council,
      },
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
  updateRegistrationCollectedByCouncil,
};
