require("dotenv").config();
const request = require("request-promise-native");

const baseUrl = "https://integration-fsa-rof-gateway.azure-api.net/registrations/v1/"
const cardiffUrl = `${baseUrl}cardiff`;
const cardiffAPIKey = b175199d420448fc87baa714e458ce6e;


describe("Retrieve all registrations through API", () => {
  describe("Given no extra parameters", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
        uri: `${cardiffUrl}?new=false`,
        json: true,
        headers: {
          "Ocp-Apim-Subscription-Key" : cardiffAPIKey
        }
      };
      response = await request(requestOptions);
    });


    //assert something

    it("should return all the new registrations for that council", () => {
      expect(response.length).toBe(1);
      expect(response.statusCode).toBe(200);
    });
  });
});
