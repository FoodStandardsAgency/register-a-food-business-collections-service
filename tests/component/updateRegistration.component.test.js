const request = require("request-promise-native");
require("dotenv").config();

const baseUrl = process.env.COMPONENT_TEST_BASE_URL || "http://localhost:4001";
const url = `${baseUrl}/api/registrations/the-vale-of-glamorgan`;

describe("PUT to /api/registrations/:lc/:fsa_rn", () => {
  describe("Given no extra parameters", () => {
    let response;
    beforeEach(async () => {
      const summaryRequestOptions = {
        uri: url,
        json: true,
      };
      const summaryResponse = await request(summaryRequestOptions);
      const requestOptions = {
        uri: `${url}/${summaryResponse[0].fsa_rn}`,
        json: true,
        method: "PUT",
        body: {
          collected: true,
        },
      };
      response = await request(requestOptions);
    });

    it("should return all the fsa_rn and collected", () => {
      expect(response.fsa_rn).toBeDefined();
      expect(response.collected).toBe(true);
    });
  });

  describe("Given council or fsa_rn which cannot be found", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}/1234253`,
        json: true,
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
          "double-mode": "invalid double mode",
        },
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
          "double-mode": "update",
        },
      };
      response = await request(requestOptions);
    });

    it("should return the double mode response", () => {
      expect(response.fsa_rn).toBe("1234");
    });
  });
});
