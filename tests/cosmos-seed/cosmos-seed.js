const { logEmitter, INFO } = require("../../src/services/logging.service");

logEmitter.emit(INFO, `Seeding registrations`);

require("dotenv").config();

const request = require("request-promise-native");
const mockRegistrationData = require("./mock-registration-data.json");
const council_urls = ["cardiff", "the-vale-of-glamorgan"];
let responses = [];

const directSubmitRegistrations = async () => {
  const url = process.env.SERVICE_BASE_URL;
  try {
    for (let index in mockRegistrationData) {
      const requestOptions = {
        uri: `${url}/api/registration/v2/createNewDirectRegistration/${council_urls[index]}`,
        method: "POST",
        json: true,
        body: mockRegistrationData[index],
        headers: {
          "Content-Type": "application/json",
          "client-name": process.env.DIRECT_API_NAME,
          "api-secret": process.env.DIRECT_API_SECRET,
          "registration-data-version": "2.1.0"
        }
      };

      const response = await request(requestOptions);
      responses.push(response);
    }
    logEmitter.emit(INFO, "Registrations seed completed");
    return responses;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "cosmos-seed",
      "directSubmitRegistrations",
      err
    );
  }
};

directSubmitRegistrations()
  .then((result) =>
    logEmitter.emit("info", `Direct submisison result - ${result}`)
  )
  .catch((err) => {
    logEmitter.emit("info", `Cosmos-seed failed - ${err}`);
  });
