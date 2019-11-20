require("dotenv").config();

const {
  getRegistrationsByCouncil,
  getRegistration,
  getRegistrations,
  updateRegistration
} = require("../../src/api/registrations/registrations.controller");

const { closeConnection } = require("../../src/db/db");

let doubleResult;
let realResult;

afterAll(() => {
  closeConnection();
});

describe("registrationDb.connector integration: getRegistrationsByCouncil", () => {
  beforeEach(async () => {
    doubleResult = await getRegistrationsByCouncil({ double_mode: "success" });
    realResult = await getRegistrationsByCouncil({
      council: "cardiff",
      fields: ["establishment", "declaration"]
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
    expect(realResult[0].declaration.declaration1).toBeDefined();
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
    expect(doubleResult[0].declaration.declaration1).toBeDefined();
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
    expect(realResult.declaration.declaration1).toBeDefined();
    expect(doubleResult.fsa_rn).toBeDefined();
    expect(doubleResult.council).toBeDefined();
    expect(doubleResult.establishment.establishment_trading_name).toBeDefined();
    expect(doubleResult.establishment.operator.operator_type).toBeDefined();
    expect(doubleResult.establishment.activities.business_type).toBeDefined();
    expect(doubleResult.establishment.premise.establishment_type).toBeDefined();
    expect(doubleResult.declaration.declaration1).toBeDefined();
  });
});

describe("registrationDb.connector integration: getRegistrations", () => {
  beforeEach(async () => {
    const before = new Date();
    let after = new Date();
    after.setDate(after.getDate() - 5);

    doubleResult = await getRegistrations({ double_mode: "success" });
    realResult = await getRegistrations({
      before: before.toISOString(),
      after: after.toISOString()
    });
  });

  it("Should return list of registrations", async () => {
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
    expect(realResult[0].declaration.declaration1).toBeDefined();
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
    expect(doubleResult[0].declaration.declaration1).toBeDefined();
  });
});

describe("registrationDb.connector integration: updateRegistrationCollected", () => {
  beforeEach(async () => {
    doubleResult = await updateRegistration({ double_mode: "update" });
    const realSummaryResult = await getRegistrationsByCouncil({
      council: "the-vale-of-glamorgan"
    });
    realResult = await updateRegistration({
      council: "the-vale-of-glamorgan",
      fsa_rn: realSummaryResult[0].fsa_rn,
      collected: true
    });
  });

  it("Should return the update response", async () => {
    expect(realResult.fsa_rn).toBeDefined();
    expect(realResult.collected).toBeDefined();
    expect(doubleResult.fsa_rn).toBeDefined();
    expect(doubleResult.collected).toBeDefined();
  });
});
