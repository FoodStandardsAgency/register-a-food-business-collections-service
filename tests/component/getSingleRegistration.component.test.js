require("dotenv").config();
const request = require("request-promise-native");

const baseUrl = process.env.COMPONENT_TEST_BASE_URL || "http://localhost:4001";
const url = `${baseUrl}/api/registrations/cardiff`;

jest.setTimeout(30000);

describe("GET to /api/registrations/:lc/:fsa_rn", () => {
  describe("Given no extra parameters", () => {
    let response;
    beforeEach(async () => {
      const before = new Date();
      let after = new Date();
      after.setSeconds(after.getSeconds() - 30);

      const summaryRequestOptions = {
        uri: `${url}?before=${before.toISOString()}&after=${after.toISOString()}&new=false`,
        json: true
      };
      const summaryResponse = await request(summaryRequestOptions);
      const requestOptions = {
        uri: `${url}/${summaryResponse[0].fsa_rn}`,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return all the full details of that registration", () => {
      expect(response.establishment.establishment_trading_name).toBe(
        "Blanda Inc"
      );
      expect(response.metadata).toBeDefined();
    });
  });

  describe("Given council or fsa_rn which cannot be found", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}/1234253`,
        json: true
      };
      try {
        await request(requestOptions);
      } catch (err) {
        response = err;
      }
    });

    it("should return the getRegistrationNotFound error", () => {
      expect(response.error).toBeDefined();
      expect(response.error.statusCode).toBe(404);
    });
  });

  describe("Given invalid parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}/1234253`,
        json: true,
        headers: {
          "double-mode": "invalid double mode"
        }
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

  describe("Given 'double-mode' header", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}`,
        json: true,
        headers: {
          "double-mode": "single"
        }
      };
      response = await request(requestOptions);
    });

    it("should return the double mode response", () => {
      expect(response.establishment.establishment_trading_name).toBe("Itsu");
    });
  });
});
