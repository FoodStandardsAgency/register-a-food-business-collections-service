jest.mock("./errors.json", () => [
  {
    name: "testError",
    code: "1",
    developerMessage: "This is a test error",
    statusCode: 400,
  },
]);

const { errorHandler } = require("./errorHandler");

const res = {
  status: jest.fn(),
  send: jest.fn(),
};

describe("Middleware: errorHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("When given an error which is not defined in errors.json", () => {
    it("Should return unknown error", () => {
      const error = {
        name: "someError",
      };
      errorHandler(error, "request", res);
      expect(res.status).toBeCalledWith(500);
      expect(res.send.mock.calls[0][0].errorCode).toBe("Unknown");
    });
  });

  describe("When given an error which is defined in errors.json", () => {
    beforeEach(() => {
      const error = {
        name: "testError",
      };
      errorHandler(error, "request", res);
    });
    it("Should return that error", () => {
      expect(res.status).toBeCalledWith(400);
      expect(res.send.mock.calls[0][0].errorCode).toBe("1");
    });
    it("Should return default raw error", () => {
      expect(res.status).toBeCalledWith(400);
      expect(res.send.mock.calls[0][0].rawError).toBe("none");
    });
  });

  describe("When given a raw error", () => {
    beforeEach(() => {
      const error = {
        name: "testError",
        rawError: "raw",
      };
      errorHandler(error, "request", res);
    });
    it("Should return that error", () => {
      expect(res.status).toBeCalledWith(400);
      expect(res.send.mock.calls[0][0].rawError).toBe("raw");
    });
  });
});
