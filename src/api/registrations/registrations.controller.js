const {
  getAllRegistrations,
  getAllRegistrationsByCouncil,
  getSingleRegistration,
  updateRegistrationCollectedByCouncil,
  updateRegistrationCollectedByUnified,
  updateAllRegistrationsCollectedByUnified
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

const getRegistrations = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "getRegistrations"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }

    const registrations = await getAllRegistrations(
      options.newForLA,
      options.newForUV,
      options.before,
      ["establishment", "metadata"]
    );
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "getRegistrations"
    );
    return registrations;
  } else {
    const error = new Error("");
    error.name = "optionsValidationError";
    error.rawError = validationResult;
    throw error;
  }
};

const updateRegistrationForUnified = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "updateRegistrationForUnified"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }

    const response = await updateRegistrationCollectedByUnified(
      options.fsa_rn,
      options.collected
    );

    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "updateRegistrationForUnified"
    );
    return response;
  } else {
    const error = new Error("");
    error.name = "optionsValidationError";
    error.rawError = validationResult;
    throw error;
  }
};

const updateAllRegistrationsForUnified = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "updateAllRegistrationsForUnified"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode){
      return registrationDbDouble(options.double_mode);
    }

    const response = await updateAllRegistrationsCollectedByUnified(
      options.newForLA,
      options.newForUV,
      options.before
    );

    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "updateAllRegistrationsForUnified"
    );
    return response;
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
  getRegistrations,
  getRegistrationsByCouncil,
  getRegistration,
  updateRegistration,
  updateRegistrationForUnified,
  updateAllRegistrationsForUnified
};
