require("dotenv").config();
const request = require("request-promise-native");

const baseUrl = process.env.COMPONENT_TEST_BASE_URL || "http://localhost:4001";
const url = `${baseUrl}/api/registrations/unified`;

describe("GET to /api/registrations/unified", () => {
  describe("Given successful parameters", () => {
    let response;
    beforeEach(async () => {
      const before = new Date();
      let after = new Date();
      after.setDate(after.getDate() - 5);

      const requestOptions = {
        uri: `${url}?before=${before
          .toISOString()
          .substring(0, 19)}&after=${after.toISOString().substring(0, 19)}`,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return all the new registrations", () => {
      expect(response.length).toBe(2);
    });
  });

  describe("Given 'double-mode' header", () => {
    let response;
    beforeEach(async () => {
      const before = new Date();
      let after = new Date();
      after.setDate(after.getDate() - 5);

      const requestOptions = {
        uri: `${url}?before=${before
          .toISOString()
          .substring(0, 19)}&after=${after.toISOString().substring(0, 19)}`,
        json: true,
        headers: {
          "double-mode": "success"
        }
      };
      response = await request(requestOptions);
    });

    it("should return the double mode response", () => {
      expect(response.length).toBe(1);
      expect(response[0].establishment.id).toBe(68);
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
