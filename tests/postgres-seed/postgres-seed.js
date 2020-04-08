require("dotenv").config();

const request = require("request-promise-native");
const mockRegistrationData = require("./mock-registration-data.json");

const submitRegistration = async () => {
  const url = process.env.SERVICE_API_URL;

  const responses = [];

  for (let index in mockRegistrationData) {
    const requestOptions = {
      uri: url,
      method: "POST",
      json: true,
      body: mockRegistrationData[index],
      headers: {
        "api-secret": process.env.SERVICE_API_SECRET,
        "client-name": process.env.SERVICE_API_CLIENT_NAME,
        "registration-data-version": process.env.REGISTRATION_DATA_VERSION,
      },
    };

    const response = await request(requestOptions);
    responses.push(response);
  }

  return responses;
};

const forceRegistrationSubmission = async (submissionResult) => {
  const url = process.env.SERVICE_BASE_URL + "/api/tasks/savetotempstore";
  console.log(submissionResult);
  responses = Promise.all(
    submissionResult.map((registration) => {
      console.log(registration);
      console.log(url + registration["fsa-rn"]);
      const requestOptions = {
        uri: url + registration["fsa-rn"],
        method: "GET",
        headers: {
          "api-secret": process.env.SERVICE_API_SECRET,
          "client-name": process.env.SERVICE_API_CLIENT_NAME,
          "registration-data-version": process.env.REGISTRATION_DATA_VERSION,
        },
      };

      return request(requestOptions);
    })
  );

  return responses;
};

submitRegistration()
  .then((submissionResult) => forceRegistrationSubmission(submissionResult))
  .then((seedResult) => console.log(seedResult));
