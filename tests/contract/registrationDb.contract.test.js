require("dotenv").config();

const {
  getRegistrationsByCouncil,
  getRegistration,
  updateRegistration
} = require("../../src/api/registrations/registrations.controller");

const { closeConnection } = require("../../src/db/db");

let doubleResult;
let realResult;

afterAll(() => {
  closeConnection();
});

describe("registrationDb.connector integration: getAllRegistrations", () => {
  beforeEach(async () => {
    doubleResult = await getRegistrationsByCouncil({ double_mode: "success" });
    realResult = await getRegistrationsByCouncil({
      council: "cardiff",
      fields: ["establishment", "metadata"]
    });
  });

  it("Should return list of registrations from council", async () => {
    expect(Array.isArray(realResult)).toBe(true);
    expect(realResult[0].fsa_rn).toBeDefined();
    expect(realResult[0].council).toBeDefined();
    expect(
      realResult[0].establishment.establishment_trading_name
    ).toBeDefined();
    expect(realResult[0].establishment.operator.operator_type).toBeDefined();
    expect(realResult[0].establishment.activities.business_type).toBeDefined();
    expect(
      realResult[0].establishment.premise.establishment_type
    ).toBeDefined();
    expect(realResult[0].metadata.declaration1).toBeDefined();
    expect(doubleResult[0].fsa_rn).toBeDefined();
    expect(doubleResult[0].council).toBeDefined();
    expect(
      doubleResult[0].establishment.establishment_trading_name
    ).toBeDefined();
    expect(doubleResult[0].establishment.operator.operator_type).toBeDefined();
    expect(
      doubleResult[0].establishment.activities.business_type
    ).toBeDefined();
    expect(
      doubleResult[0].establishment.premise.establishment_type
    ).toBeDefined();
    expect(doubleResult[0].metadata.declaration1).toBeDefined();
  });
});

describe("registrationDb.connector integration: getSingleRegistrations", () => {
  beforeEach(async () => {
    doubleResult = await getRegistration({ double_mode: "single" });
    const realSummaryResult = await getRegistrationsByCouncil({
      council: "cardiff"
    });
    realResult = await getRegistration({
      council: "cardiff",
      fsa_rn: realSummaryResult[0].fsa_rn
    });
  });

  it("Should return single of registrations from council", async () => {
    expect(Array.isArray(realResult)).toBe(false);
    expect(realResult.fsa_rn).toBeDefined();
    expect(realResult.council).toBeDefined();
    expect(realResult.establishment.establishment_trading_name).toBeDefined();
    expect(realResult.establishment.operator.operator_type).toBeDefined();
    expect(realResult.establishment.activities.business_type).toBeDefined();
    expect(realResult.establishment.premise.establishment_type).toBeDefined();
    expect(realResult.metadata.declaration1).toBeDefined();
    expect(doubleResult.fsa_rn).toBeDefined();
    expect(doubleResult.council).toBeDefined();
    expect(doubleResult.establishment.establishment_trading_name).toBeDefined();
    expect(doubleResult.establishment.operator.operator_type).toBeDefined();
    expect(doubleResult.establishment.activities.business_type).toBeDefined();
    expect(doubleResult.establishment.premise.establishment_type).toBeDefined();
    expect(doubleResult.metadata.declaration1).toBeDefined();
  });
});

describe("registrationDb.connector integration: updateRegistrationCollected", () => {
  beforeEach(async () => {
    doubleResult = await updateRegistration({ double_mode: "update" });
    const realSummaryResult = await getRegistrationsByCouncil({
      council: "the-vale-of-glamorgan"
    });
    realResult = await getRegistration({
      council: "the-vale-of-glamorgan",
      fsa_rn: realSummaryResult[0].fsa_rn
    });
  });

  it("Should return the update response", async () => {
    expect(realResult.fsa_rn).toBeDefined();
    expect(realResult.collected).toBeDefined();
    expect(doubleResult.fsa_rn).toBeDefined();
    expect(doubleResult.collected).toBeDefined();
  });
});
