require("dotenv").config();
const request = require("request-promise-native");

const baseUrl = process.env.COMPONENT_TEST_BASE_URL || "http://localhost:4001";
const url = `${baseUrl}/api/registrations/all`;

describe("GET to /api/registrations/all", () => {
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

    it("should return all the new registrations", () => {
      expect(response.length).toBe(2);
    });
  });

  describe("Given invalid newForUV parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}?newForUV=alskdfj`,
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

  describe("Given invalid newForLA parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}?newForLA=alskdfj`,
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

  describe("Given invalid newForUV parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}?newForUV=alskdfj`,
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

  describe("Given 'newForUV=false' parameter", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}?new=false`,
        json: true
      };
      response = await request(requestOptions);
    });

    it("should return all the registrations for the council", () => {
      expect(response.length).toBe(2);
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
