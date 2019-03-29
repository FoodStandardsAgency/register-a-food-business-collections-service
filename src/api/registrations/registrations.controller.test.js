jest.mock("../../connectors/registrationDb/registrationDb.connector", () => ({
  getAllRegistrationsByCouncil: jest.fn(),
  getUnifiedRegistrations: jest.fn(),
  getSingleRegistration: jest.fn(),
  updateRegistrationCollectedByCouncil: jest.fn(),
  registrationDbDouble: jest.fn(),
}));

jest.mock("./registrations.service");

const { validateOptions } = require("./registrations.service");

const {
  getAllRegistrationsByCouncil,
  getSingleRegistration,
  getUnifiedRegistrations,
  updateRegistrationCollectedByCouncil
} = require("../../connectors/registrationDb/registrationDb.connector");

const {
  getRegistrationsByCouncil,
  getRegistration,
  getRegistrations,
  updateRegistration
} = require("./registrations.controller");

describe("registrations.controller", () => {
  let result;
  describe("Function: getRegistrationsByCouncil", () => {
    describe("When given invalid getNewRegistrations option", () => {
      beforeEach(async () => {
        try {
          validateOptions.mockImplementation(() => false);
          await getRegistrationsByCouncil({
            getNewRegistrations: "not a boolean"
          });
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
        result = await getRegistrationsByCouncil({
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
        getAllRegistrationsByCouncil.mockImplementation(() => [
          { id: 1, data: "data" }
        ]);
        result = await getRegistrationsByCouncil({
          getNewRegistrations: "true",
          council: "cardiff"
        });
      });

      it("Should return the result of getAllRegistrationsByCouncil", () => {
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
        updateRegistrationCollectedByCouncil.mockImplementation(() => ({
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

  describe("Function: getRegistrations", () => {
    describe("When given invalid option", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => false);
        try {
          await getRegistrations({ before: "true" });
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
          before: "2019-01-01",
          after: "2019-02-01",
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
        getUnifiedRegistrations.mockImplementation(() => [
          {
            fsa_rn: "5768",
            collected: true
          }
        ]);
        result = await getRegistrations({
          before: "2019-01-01",
          after: "2019-02-01"
        });
      });
      it("Should return the response", () => {
        expect(result).toEqual([{ fsa_rn: "5768", collected: true }]);
      });
    });
  });
});
