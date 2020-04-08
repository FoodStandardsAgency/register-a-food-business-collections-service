const winston = require("winston");

const createLogger = (level) =>
  winston.createLogger({
    level: level || "info",
    format: winston.format.colorize(),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

module.exports = { createLogger };
