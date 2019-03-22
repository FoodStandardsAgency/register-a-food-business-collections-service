const { logEmitter } = require("../../services/logging.service");
const { isISO8601 } = require("validator");

const validateString = value => {
  return typeof value === "string";
};

const validateBoolean = value => {
  return typeof value === "boolean";
};

const validateBooleanString = value => {
  const validValues = ["true", "false"];
  return validValues.includes(value);
};

const doubleModes = ["success", "fail", "update", "single", "updateMany", ""];
const validateDoubleMode = value => {
  return doubleModes.includes(value);
};

const allowedFields = ["metadata", "establishment"];
const validateFields = value => {
  if (!Array.isArray(value)) {
    return false;
  }
  // Checks allowedFields.includes for every element of array. Array.every returns true for empty array
  return value.every(val => allowedFields.includes(val));
};

const validateDateTime = value => {
  if (!validateString(value)) {
    return false;
  }
  return isISO8601(value);
};

const validationFields = {
  council: {
    function: validateString,
    message: "council option must be a string"
  },
  double_mode: {
    function: validateDoubleMode,
    message: `double mode option must be one of ${doubleModes}`
  },
  new: {
    function: validateBooleanString,
    message: "new option must be a boolean"
  },
  fields: {
    function: validateFields,
    message: `fields options must be the from the following list: ${allowedFields}`
  },
  collected: {
    function: validateBoolean,
    message: "collected option must be a boolean"
  },
  fsa_rn: {
    function: validateString,
    message: "fsa_rn option must be a string"
  },
  before: {
    function: validateDateTime,
    message: "before option must be date of format 'yyyy-MM-ddTHH:mm:ssZ'"
  },
  newForLA: {
    function: validateBooleanString,
    message: "newForLA option must be a boolean"
  },
  newForUV: {
    function: validateBooleanString,
    message: "newForUV option must be a boolean"
  }
};

const validateOptions = options => {
  logEmitter.emit("functionCall", "registrations.service", "validateOptions");

  for (const key in options) {
    // Check if the validation function for each key returns true or false for the associated value
    if (!validationFields[key].function(options[key])) {
      logEmitter.emit(
        "functionFail",
        "registrations.service",
        "validateOptions",
        new Error(validationFields[key].message)
      );
      return validationFields[key].message;
    }
  }
  logEmitter.emit(
    "functionSuccess",
    "registrations.service",
    "validateOptions"
  );
  return true;
};

module.exports = { validateOptions };
