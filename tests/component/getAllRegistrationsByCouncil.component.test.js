require("dotenv").config();
const request = require("request-promise-native");

const baseUrl = process.env.COMPONENT_TEST_BASE_URL || "http://localhost:4001";
const url = `${baseUrl}/api/registrations/cardiff`;

describe("GET to /api/registrations/:lc", () => {
  describe("Given no extra parameters", () => {
    let response;
    beforeEach(async () => {
      // await resetDB();
      const requestOptions = {
        uri: url,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return all the new registrations for that council", () => {
      expect(response.length).toBe(1);
    });
  });

  describe("Given invalid parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}?new=alskdfj`,
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

  describe("Given no 'fields' parameter", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: url,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return on the summary information for the registrations", () => {
      expect(response[0].establishment).toEqual({});
      expect(response[0].metadata).toEqual({});
    });
  });

  describe("Given 'fields' parameter", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}?fields=establishment,metadata`,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return all the new registrations for that council", () => {
      expect(
        response[0].establishment.establishment_trading_name
      ).toBeDefined();
      expect(response[0].metadata.declaration1).toBeDefined();
    });
  });

  describe("Given 'new=false' parameter", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}?new=false`,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return all the registrations for the council", () => {
      expect(response.length).toBe(1);
    });
  });

  describe("Given 'double-mode' header", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}`,
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
});
