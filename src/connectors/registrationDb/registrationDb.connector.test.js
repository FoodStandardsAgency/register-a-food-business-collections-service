const { isISO8601 } = require("validator");
jest.mock("../../db/db", () => ({
  Activities: {
    findOne: jest.fn()
  },
  Establishment: {
    findOne: jest.fn()
  },
  Metadata: {
    findOne: jest.fn()
  },
  Operator: {
    findOne: jest.fn()
  },
  Premise: {
    findOne: jest.fn()
  },
  Registration: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn()
  }
}));

const {
  Activities,
  Establishment,
  Metadata,
  Operator,
  Premise,
  Registration
} = require("../../db/db");

const {
  getAllRegistrations,
  updateRegistrationCollected
} = require("./registrationDb.connector");

describe("collect.service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Function: getAllRegistrations", () => {
    let result;
    describe("when collected is true", () => {
      beforeEach(() => {
        Registration.findAll.mockImplementation(() => [
          { id: 1, dataValues: { fsa_rn: "1234" } },
          { id: 2, dataValues: { fsa_rn: "5678" } }
        ]);

        Establishment.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { establishment_trading_name: "taco" }
        }));
        Operator.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { operator_name: "fred" }
        }));
        Activities.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { business_type: "cookies" }
        }));
        Premise.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { establishment_postcode: "ER1 56GF" }
        }));
        Metadata.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { declaration1: "yes" }
        }));
        result = getAllRegistrations("cardiff", true);
      });

      it("should call registration.findAll with queryArray [true, false, null]", () => {
        expect(Registration.findAll.mock.calls[0][0].where.collected).toEqual([
          true,
          false,
          null
        ]);
      });
    });

    describe("when collected is false", () => {
      beforeEach(() => {
        Registration.findAll.mockImplementation(() => [
          { id: 1, dataValues: { fsa_rn: "1234" } },
          { id: 2, dataValues: { fsa_rn: "5678" } }
        ]);

        Establishment.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { establishment_trading_name: "taco" }
        }));
        Operator.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { operator_name: "fred" }
        }));
        Activities.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { business_type: "cookies" }
        }));
        Premise.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { establishment_postcode: "ER1 56GF" }
        }));
        Metadata.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { declaration1: "yes" }
        }));
        result = getAllRegistrations("cardiff", false);
      });

      it("should call registration.findAll with queryArray [false, null]", () => {
        expect(Registration.findAll.mock.calls[0][0].where.collected).toEqual([
          false,
          null
        ]);
      });
    });

    describe("when registration.findAll throws an erorr", () => {
      beforeEach(async () => {
        Registration.findAll.mockImplementation(() => {
          throw new Error("Failed");
        });

        try {
          await getAllRegistrations("west-dorset", false);
        } catch (err) {
          result = err;
        }
      });
      it("should bubble the error up ", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("when model.findOne throws an erorr", () => {
      beforeEach(async () => {
        Registration.findAll.mockImplementation(() => [
          { id: 1, dataValues: { fsa_rn: "1234" } },
          { id: 2, dataValues: { fsa_rn: "5678" } }
        ]);
        Establishment.findOne.mockImplementation(() => {
          throw new Error("Failed");
        });

        try {
          await getAllRegistrations("west-dorset", false);
        } catch (err) {
          result = err;
        }
      });
      it("should bubble the error up ", () => {
        expect(result.message).toBe("Failed");
        expect(result.name).toBe("dbModelFindOneError");
      });
    });
  });

  describe("Function: updateRegistrationCollected", () => {
    let result;
    describe("When Registration.update is successful", () => {
      beforeEach(async () => {
        Registration.update.mockImplementation(() => [1]);
        result = await updateRegistrationCollected("1234", true);
      });

      it("Should return fsa_rn and collected", () => {
        expect(result).toEqual({ fsa_rn: "1234", collected: true });
      });

      it("Should pass collected to registration update", () => {
        expect(Registration.update.mock.calls[0][0].collected).toBe(true);
      });

      it("Should pass fsa_rn to registration update", () => {
        expect(Registration.update.mock.calls[0][1].where.fsa_rn).toBe("1234");
      });

      it("Should call update with ISO date", () => {
        expect(
          isISO8601(Registration.update.mock.calls[0][0].collected_at)
        ).toBe(true);
      });
    });

    describe("When Registration.update throws an error", () => {
      beforeEach(async () => {
        Registration.update.mockImplementation(() => {
          throw new Error("Failed");
        });
        try {
          await updateRegistrationCollected("1234", true);
        } catch (err) {
          result = err;
        }
      });

      it("Should bubble the error up", () => {
        expect(result.message).toBe("Failed");
      });
    });
  });
});
