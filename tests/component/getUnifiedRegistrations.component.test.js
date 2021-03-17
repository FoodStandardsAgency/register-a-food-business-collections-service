require("dotenv").config();
const request = require("request-promise-native");

const baseUrl = process.env.COMPONENT_TEST_BASE_URL || "http://localhost:4001";
const url = `${baseUrl}/api/registrations/unified`;

jest.setTimeout(30000);

describe("GET to /api/registrations/unified", () => {
  describe("Given successful parameters", () => {
    let response;
    beforeEach(async () => {
      const before = new Date();
      let after = new Date();
      after.setSeconds(after.getSeconds() - 30);

      const requestOptions = {
        uri: `${url}?before=${before.toISOString()}&after=${after.toISOString()}`,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return all the new registrations", () => {
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Given before and after are both in the future", () => {
    let response;
    beforeEach(async () => {
      let before = new Date();
      let after = new Date();
      before.setDate(before.getDate() + 20);
      after.setDate(after.getDate() + 15);

      const requestOptions = {
        uri: `${url}?before=${before.toISOString()}&after=${after.toISOString()}`,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return zero new registrations", () => {
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(0);
    });
  });

  describe("Given before and after are both before records began", () => {
    let response;
    beforeEach(async () => {
      let before = new Date();
      let after = new Date();
      before.setMinutes(before.getMinutes() - 1);
      after.setMinutes(after.getMinutes() - 2);

      const requestOptions = {
        uri: `${url}?before=${before.toISOString()}&after=${after.toISOString()}`,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return zero new registrations", () => {
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(0);
    });
  });

  describe("Given 'double-mode' header", () => {
    let response;
    beforeEach(async () => {
      const before = new Date();
      let after = new Date();
      after.setDate(after.getDate() - 5);

      const requestOptions = {
        uri: `${url}?before=${before.toISOString()}&after=${after.toISOString()}`,
        json: true,
        headers: {
          "double-mode": "success"
        }
      };
      response = await request(requestOptions);
    });

    it("should return the double mode response", () => {
      expect(response.length).toBe(1);
      expect(response[0].establishment.establishment_trading_name).toBe("Itsu");
    });
  });

  describe("Given before and after range greater than 7 days", () => {
    let response;
    beforeEach(async () => {
      const before = new Date();
      let after = new Date();
      after.setDate(after.getDate() - 8);

      const requestOptions = {
        uri: `${url}?before=${before.toISOString()}&after=${after.toISOString()}`,
        json: true
      };
      try {
        await request(requestOptions);
      } catch (err) {
        response = err;
      }
    });

    it("should return the options validation error", () => {
      expect(response.statusCode).toBe(400);
      expect(response.error.errorCode).toBe("3");
      expect(response.error.developerMessage).toBe(
        "One of the supplied options is invalid"
      );
    });
  });

  describe("Given no parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}`,
        json: true
      };
      try {
        await request(requestOptions);
      } catch (err) {
        response = err;
      }
    });

    it("should return the options validation error", () => {
      expect(response.statusCode).toBe(400);
      expect(response.error.errorCode).toBe("3");
      expect(response.error.developerMessage).toBe(
        "One of the supplied options is invalid"
      );
    });
  });
});
