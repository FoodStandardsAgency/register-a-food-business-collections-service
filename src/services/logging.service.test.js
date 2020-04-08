const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock("./logger", () => ({
  createLogger: () => mockLogger,
}));

// const { logger } = require("./logger");
const { logEmitter } = require("./logging.service");

describe("logEmitter", () => {
  describe("on functionCall event", () => {
    it("should call winston info", () => {
      logEmitter.emit("functionCall");
      expect(mockLogger.info).toBeCalled();
    });
  });

  describe("on functionSuccess event", () => {
    it("should call winston info", () => {
      logEmitter.emit("functionSuccess");
      expect(mockLogger.info).toBeCalled();
    });
  });

  describe("on functionFail event", () => {
    it("should call winston error", () => {
      logEmitter.emit("functionFail", "module", "function", {
        message: "error",
      });
      expect(mockLogger.error).toBeCalled();
    });
  });

  describe("on doubleMode event", () => {
    it("should call winston info", () => {
      logEmitter.emit("doubleMode");
      expect(mockLogger.info).toBeCalled();
    });
  });
});
