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
        json: true
      };
      const summaryResponse = await request(summaryRequestOptions);
      const requestOptions = {
        uri: `${url}/${summaryResponse[0].fsa_rn}`,
        json: true,
        method: "PUT",
        body: {
          collected: true
        }
      };
      response = await request(requestOptions);
    });

    it("should return all the fsa_rn and collected", () => {
      expect(response.fsa_rn).toBeDefined();
      expect(response.collected).toBe(true);
    });
  });

  describe("Given council or fsa_rn which cannot be found", () => {});

  describe("Given invalid parameters", () => {});

  describe("Given 'double-mode' header", () => {});
});
