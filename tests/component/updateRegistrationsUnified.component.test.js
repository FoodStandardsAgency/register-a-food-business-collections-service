const request = require("request-promise-native");
require("dotenv").config();

const baseUrl = process.env.COMPONENT_TEST_BASE_URL || "http://localhost:4001";
const url = `${baseUrl}/api/registrations/all`;

describe("PUT to /api/registrations/all", () => {
  describe("Given no extra parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}`,
        json: true,
        method: "PUT",
        body: {
          collected: true
        }
      };
      response = await request(requestOptions);
    });

    it("should return all the fsa_rn and collected", () => {
      expect(response[0].fsa_rn).toBeDefined();
      expect(response[0].unified_view_collected).toBe(true);
    });
  });

  describe("Given invalid double mode", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}`,
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

  describe("Given invalid newForUV parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}?newForUV=asdf`,
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
        uri: `${url}?newForLA=asdf`,
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

  describe("Given 'double-mode' header", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${url}`,
        json: true,
        headers: {
          "double-mode": "updateUnifiedMany"
        }
      };
      response = await request(requestOptions);
    });

    it("should return the double mode response", () => {
      expect(response[0].fsa_rn).toBe("1234");
      expect(response[0].unified_view_collected).toBe(true);
    });
  });
});
