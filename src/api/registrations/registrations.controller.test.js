jest.mock("../../connectors/registrationDb/registrationDb.connector", () => ({
  getAllRegistrations: jest.fn(),
  getSingleRegistration: jest.fn(),
  updateRegistrationCollected: jest.fn(),
  registrationDbDouble: jest.fn()
}));

jest.mock("./registrations.service");

const { validateOptions } = require("./registrations.service");

const {
  getAllRegistrations,
  getSingleRegistration,
  updateRegistrationCollected
} = require("../../connectors/registrationDb/registrationDb.connector");

const {
  getRegistrations,
  getRegistration,
  updateRegistration,
  resetRegistrations
} = require("./registrations.controller");

describe("registrations.controller", () => {
  let result;
  describe("Function: getRegistrations", () => {
    describe("When given invalid getNewRegistrations option", () => {
      beforeEach(async () => {
        try {
          validateOptions.mockImplementation(() => false);
          await getRegistrations({ getNewRegistrations: "not a boolean" });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("optionsValidationError");
      });
    });
    describe("When given double mode", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        result = await getRegistrations({
          getNewRegistrations: "true",
          double_mode: "success"
        });
      });
      it("Should return the double response", () => {
        expect(result[0].establishment.id).toBe(68);
      });
    });
    describe("When successful", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        getAllRegistrations.mockImplementation(() => [{ id: 1, data: "data" }]);
        result = await getRegistrations({
          getNewRegistrations: "true",
          council: "cardiff"
        });
      });

      it("Should return the result of getAllRegistrations", () => {
        expect(result).toEqual([{ id: 1, data: "data" }]);
      });
    });
  });

  describe("Function: getRegistration", () => {
    describe("When given invalid option", () => {
      beforeEach(async () => {
        try {
          validateOptions.mockImplementation(() => false);
          await getRegistration({ fsa_rn: "not valid" });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("optionsValidationError");
      });
    });
    describe("When given double mode", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        result = await getRegistration({
          double_mode: "single"
        });
      });
      it("Should return the double response", () => {
        expect(result.establishment.id).toBe(68);
      });
    });
    describe("When successful", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        getSingleRegistration.mockImplementation(() => ({
          id: 1,
          data: "data"
        }));
        result = await getRegistration({
          getNewRegistrations: "true",
          council: "cardiff"
        });
      });

      it("Should return the result of getSingleRegistration", () => {
        expect(result).toEqual({ id: 1, data: "data" });
      });
    });
  });

  describe("Function: updateRegistration", () => {
    describe("When given invalid collected option", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => false);
        try {
          await updateRegistration({ collected: "true" });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("optionsValidationError");
      });
    });
    describe("When given double mode", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        result = await updateRegistration({
          collected: true,
          double_mode: "update"
        });
      });
      it("Should return the double response", () => {
        expect(result).toEqual({ fsa_rn: "1234", collected: true });
      });
    });
    describe("When successful", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        updateRegistrationCollected.mockImplementation(() => ({
          fsa_rn: "5768",
          collected: true
        }));
        result = await updateRegistration({
          collected: true,
          fsa_rn: "5768"
        });
      });
      it("Should return the response of updateRegistrationCollected", () => {
        expect(result).toEqual({ fsa_rn: "5768", collected: true });
      });
    });
  });

  describe("Function: resetRegistrations", () => {
    describe("When given invalid council option", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => false);
        try {
          await resetRegistrations({ council: [] });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("optionsValidationError");
      });
    });

    describe("When given double mode", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        result = await resetRegistrations({
          collected: true,
          double_mode: "reset"
        });
      });
      it("Should return the double response", () => {
        expect(result[0]).toEqual({ fsa_rn: "1234", collected: false });
      });
    });
    describe("When successful", () => {
      const mockRegistrations = [
        {
          fsa_rn: "5768",
          collected: true,
          council: "cardiff"
        },
        {
          fsa_rn: "5770",
          collected: true,
          council: "cardiff"
        },
        {
          fsa_rn: "5769",
          collected: true,
          council: "cardiff"
        }
      ];
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        getAllRegistrations.mockImplementation(() => mockRegistrations);
        updateRegistrationCollected.mockImplementation((fsa_rn, collected) => ({
          fsa_rn,
          collected
        }));
        result = await resetRegistrations("cardiff");
      });
      it("Should return the multiples responses of updateRegistration", () => {
        expect(result[0]).toEqual({ fsa_rn: "5768", collected: false });
      });
    });
  });
});
