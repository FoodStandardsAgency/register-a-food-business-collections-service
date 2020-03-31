const {
  getRegistrations,
  getRegistration,
  updateRegistration
} = require("../../src/api/registrations/registrations.controller");

describe("registrationDb.connector integration: getAllRegistrations", () => {
  it("Should return list of registrations from council", async () => {
    const result = await getRegistrations({ double_mode: "success" });
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].fsa_rn).toBeDefined();
    expect(result[0].council).toBeDefined();
    expect(result[0].establishment.establishment_trading_name).toBeDefined();
    expect(result[0].establishment.operator.operator_type).toBeDefined();
    expect(result[0].establishment.activities.business_type).toBeDefined();
    expect(result[0].establishment.premise.establishment_type).toBeDefined();
    expect(result[0].metadata.declaration1).toBeDefined();
  });
});

describe("registrationDb.connector integration: getSingleRegistration", () => {
  it("Should return single registration from council", async () => {
    const result = await getRegistration({ double_mode: "single" });
    expect(Array.isArray(result)).toBe(false);
    expect(result.fsa_rn).toBeDefined();
    expect(result.council).toBeDefined();
    expect(result.establishment.establishment_trading_name).toBeDefined();
    expect(result.establishment.operator.operator_type).toBeDefined();
    expect(result.establishment.activities.business_type).toBeDefined();
    expect(result.establishment.premise.establishment_type).toBeDefined();
    expect(result.metadata.declaration1).toBeDefined();
  });
});

describe("registrationDb.connector integration: updateRegistrationCollected", () => {
  it("Should return single registration from council", async () => {
    const result = await updateRegistration({ double_mode: "update" });
    expect(result.fsa_rn).toBeDefined();
    expect(result.collected).toBeDefined();
  });
});
