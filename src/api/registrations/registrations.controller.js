const {
  getAllRegistrations,
  getSingleRegistration,
  updateRegistrationCollected
} = require("../../connectors/registrationDb/registrationDb.connector");

const { validateOptions } = require("./registrations.service");

const {
  registrationDbDouble
} = require("../../connectors/registrationDb/registrationDb.double");

const { logEmitter } = require("../../services/logging.service");

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
      options.council,
      options.new,
      options.fields
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

const getRegistration = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "getSingleRegistration"
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
      "getRegistrations"
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

    const response = await updateRegistrationCollected(
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

const resetRegistrations = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "resetRegistrations"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }

    const registrations = await getAllRegistrations(options.council, false, []);

    const updatePromises = [];

    registrations.forEach(registration => {
      updatePromises.push(
        updateRegistrationCollected(
          registration.fsa_rn,
          false,
          registration.council
        )
      );
    });

    const response = await Promise.all(updatePromises);

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
  getRegistration,
  updateRegistration,
  resetRegistrations
};
