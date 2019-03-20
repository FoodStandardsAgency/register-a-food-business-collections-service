const {
  getAllRegistrationsByCouncil,
  getSingleRegistration,
  updateRegistrationCollectedByCouncil
} = require("../../connectors/registrationDb/registrationDb.connector");

const { validateOptions } = require("./registrations.service");

const {
  registrationDbDouble
} = require("../../connectors/registrationDb/registrationDb.double");

const { logEmitter } = require("../../services/logging.service");

const getRegistrationsByCouncil = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "getRegistrationsByCouncil"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }
    const registrations = await getAllRegistrationsByCouncil(
      options.council,
      options.new,
      options.fields
    );
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "getRegistrationsByCouncil"
    );
    return registrations;
  } else {
    const error = new Error("");
    error.name = "optionsValidationError";
    error.rawError = validationResult;
    throw error;
  }
};

const getRegistration = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "getRegistration"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }
    const registration = await getSingleRegistration(
      options.fsa_rn,
      options.council
    );
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "getRegistration"
    );
    return registration;
  } else {
    const error = new Error("");
    error.name = "optionsValidationError";
    error.rawError = validationResult;
    throw error;
  }
};

const updateRegistration = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "updateRegistration"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }

    const response = await updateRegistrationCollectedByCouncil(
      options.fsa_rn,
      options.collected,
      options.council
    );

    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "updateRegistration"
    );

    return response;
  } else {
    const error = new Error("");
    error.name = "optionsValidationError";
    error.rawError = validationResult;
    throw error;
  }
};

module.exports = {
  getRegistrationsByCouncil,
  getRegistration,
  updateRegistration
};
