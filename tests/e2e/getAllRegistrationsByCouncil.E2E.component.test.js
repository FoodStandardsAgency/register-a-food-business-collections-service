require("dotenv").config();
const request = require("request-promise-native");

const baseUrl =
  "https://integration-fsa-rof-gateway.azure-api.net/registrations/v1/";
const cardiffUrl = `${baseUrl}cardiff`;
const cardiffAPIKey = "b175199d420448fc87baa714e458ce6e";

describe("Retrieve all registrations through API", () => {
  describe("Given no extra parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${cardiffUrl}`,
        json: true,
        resolveWithFullResponse: true,
        headers: {
          "Ocp-Apim-Subscription-Key": cardiffAPIKey
        }
      };
      response = await request(requestOptions);
    });

    it("should return all the new registrations for that council", () => {
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0].fsa_rn).toBeDefined();
      expect(response.body[0].collected).toBe(false);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Given invalid local authority", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${baseUrl}incorrectAuthority`,
        json: true,
        headers: {
          "Ocp-Apim-Subscription-Key": cardiffAPIKey
        }
      };

      await request(requestOptions).catch(function(body) {
        response = body;
      });
    });

    it("Should return the appropriate error", () => {
      expect(response.statusCode).toBe(403);
      expect(response.error.message).toContain(
        "You are not authorized to access the council"
      );
    });
  });

  describe("Given invalid subscription key", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: cardiffUrl,
        json: true,
        headers: {
          "Ocp-Apim-Subscription-Key": "incorrectKey"
        }
      };
      await request(requestOptions).catch(function(body) {
        response = body;
      });
    });

    it("should return a subscription incorrect error", () => {
      expect(response.statusCode).toBe(401);
      expect(response.error.message).toContain("invalid subscription key.");
    });
  });

  describe("Given no subscription key", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: cardiffUrl,
        json: true
      };
      await request(requestOptions).catch(function(body) {
        response = body;
      });
    });

    it("Should return subscription key not found error", () => {
      expect(response.statusCode).toBe(401);
      expect(response.error.message).toContain(
        "Access denied due to missing subscription key."
      );
    });
  });

  describe("Given invalid parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${cardiffUrl}?new=alskdfj`,
        json: true,
        headers: {
          "Ocp-Apim-Subscription-Key": cardiffAPIKey
        }
      };
      await request(requestOptions).catch(function(body) {
        response = body;
      });
    });

    it("should return the options validation error", () => {
      expect(response.statusCode).toBe(400);
      expect(response.error.errorCode).toBe("3");
      expect(response.error.developerMessage).toBe(
        "One of the supplied options is invalid"
      );
      expect(response.error.rawError).toBe("new option must be a boolean");
    });
  });
});
