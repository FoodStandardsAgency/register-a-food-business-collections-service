const { establishConnectionToCosmos } = require("../cosmos.client");
const { logEmitter } = require("../../services/logging.service");

const getRegistrationsByCouncils = async (
  councils,
  collected,
  before,
  after
) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v2.connector",
    "getRegistrationsByCouncils"
  );
  try {
    const registrationsCollection = await establishConnectionToCosmos(
      "registrations",
      "registrations"
    );

    const registrations = await registrationsCollection
      .find(
        {
          $and: [
            { local_council_url: { $in: councils } },
            { collected: { $in: collected } },
            { createdAt: { $gte: new Date(after) } },
            { createdAt: { $lte: new Date(before) } }
          ]
        },
        { projection: { _id: 0, "fsa-rn": 1 } }
      )
      .toArray();

    logEmitter.emit(
      "functionSuccess",
      "registrationsDb.v2.connector",
      "getRegistrationsByCouncils"
    );

    return registrations;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registrationsDb.v2.connector",
      "getRegistrationsByCouncils",
      err
    );
    throw err;
  }
};

const getAllRegistrations = async (before, after) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v2.connector",
    "getAllRegistrations"
  );
  try {
    let registrationsCollection = await establishConnectionToCosmos(
      "registrations",
      "registrations"
    );

    const registrations = await registrationsCollection
      .find(
        {
          $and: [
            { createdAt: { $gte: after } },
            { createdAt: { $lte: before } }
          ]
        },
        { projection: { _id: 0, "fsa-rn": 1 } }
      )
      .toArray();
    logEmitter.emit(
      "functionSuccess",
      "registrationsDb.v2.connector",
      "getAllRegistrations"
    );
    return registrations;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registrationsDb.v2.connector",
      "getAllRegistrations",
      err
    );
    throw err;
  }
};

const getFullRegistration = async (fsa_rn, fields = []) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v2.connector",
    "getFullRegistration"
  );
  try {
    const projection = Object.assign(
      {
        _id: 0,
        "fsa-rn": 1,
        collected: 1,
        collected_at: 1,
        createdAt: 1,
        updatedAt: 1
      },
      fields.includes("establishment") ? { establishment: 1 } : {},
      fields.includes("metadata") ? { metadata: 1 } : {},
      {
        "hygiene.local_council": 1,
        "hygieneAndStandards.local_council": 1,
        local_council_url: 1,
        source_council_id: 1
      }
    );

    let registrationsCollection = await establishConnectionToCosmos(
      "registrations",
      "registrations"
    );

    const registration = await registrationsCollection.findOne(
      {
        "fsa-rn": fsa_rn
      },
      { projection: projection }
    );

    logEmitter.emit(
      "functionSuccess",
      "registrationsDb.v2.connector",
      "getFullRegistration"
    );

    return registration;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registrationsDb.v2.connector",
      "getFullRegistration",
      err
    );
    throw err;
  }
};

const getSingleRegistration = async (fsa_rn, council) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v2.connector",
    "getSingleRegistration"
  );

  const projection = Object.assign({
    _id: 0,
    "fsa-rn": 1,
    collected: 1,
    collected_at: 1,
    createdAt: 1,
    updatedAt: 1,
    establishment: 1,
    metadata: 1,
    "hygiene.local_council": 1,
    "hygieneAndStandards.local_council": 1,
    local_council_url: 1,
    source_council_id: 1
  });

  let registrationsCollection = await establishConnectionToCosmos(
    "registrations",
    "registrations"
  );

  const registration = await registrationsCollection.findOne(
    {
      "fsa-rn": fsa_rn,
      local_council_url: council
    },
    { projection: projection }
  );

  if (registration === null) {
    const error = new Error("getRegistrationNotFoundError");
    error.name = "getRegistrationNotFoundError";
    logEmitter.emit(
      "functionFail",
      "registrationsDb.v2.connector",
      "getSingleRegistration",
      error
    );
    throw error;
  }
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.v2.connector",
    "getSingleRegistration"
  );

  return registration;
};

const getUnifiedRegistrations = async (before, after) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v2.connector",
    "getUnifiedRegistrations"
  );

  // convert ISOStrings to Date type
  const beforeDate = new Date(before);
  const afterDate = new Date(after);

  const registrations = await getAllRegistrations(beforeDate, afterDate);
  const fullRegistrations = await Promise.all(
    registrations.map(async (registration) => {
      return getFullRegistration(registration["fsa-rn"], [
        "establishment",
        "metadata"
      ]);
    })
  );

  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.v2.connector",
    "getUnifiedRegistrations"
  );
  return fullRegistrations;
};

const getAllRegistrationsByCouncils = async (
  councils,
  newRegistrations,
  fields,
  before,
  after
) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v2.connector",
    "getAllRegistrationsByCouncils"
  );

  // get NEW [false, null] or EVERYTHING [true, false, null]
  const queryArray = newRegistrations === "true" ? [false] : [true, false];
  const registrations = await getRegistrationsByCouncils(
    councils,
    queryArray,
    before,
    after
  );

  const fullRegistrations = await Promise.all(
    registrations.map(async (registration) => {
      return getFullRegistration(registration["fsa-rn"], fields);
    })
  );
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.v2.connector",
    "getAllRegistrationsByCouncils"
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
    "registrationsDb.v2.connector",
    "updateRegistrationCollectedByCouncil"
  );

  let registrationsCollection = await establishConnectionToCosmos(
    "registrations",
    "registrations"
  );

  const response = await registrationsCollection.updateOne(
    {
      "fsa-rn": fsa_rn,
      local_council_url: council
    },
    {
      $set: {
        collected: collected,
        collected_at: new Date(),
        updatedAt: new Date()
      }
    }
  );
  if (response.result.n === 0) {
    const error = new Error("updateRegistrationNotFoundError");
    error.name = "updateRegistrationNotFoundError";
    logEmitter.emit(
      "functionFail",
      "registrationsDb.v2.connector",
      "updateRegistrationCollectedByCouncil",
      error
    );
    throw error;
  }
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.v2.connector",
    "updateRegistrationCollectedByCouncil"
  );
  return { fsa_rn, collected };
};

module.exports = {
  getSingleRegistration,
  getUnifiedRegistrations,
  getAllRegistrationsByCouncils,
  updateRegistrationCollectedByCouncil
};
