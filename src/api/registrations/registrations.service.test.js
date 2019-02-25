const { validateOptions } = require("./registrations.service");

describe("registrations.service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  let result;
  describe("Function: validateOptions", () => {
    describe("When given valid council", () => {
      beforeEach(() => {
        const options = {
          council: "cardiff"
        };
        result = validateOptions(options);
      });

      it("should return true", () => {
        expect(result).toBe(true);
      });
    });

    describe("When given invalid council", () => {
      const invalidCouncils = [1233, [], {}, false, null, undefined];
      invalidCouncils.forEach(council => {
        result = validateOptions({ council });
        expect(result).not.toBe(true);
      });
    });

    describe("When given valid double_mode", () => {
      beforeEach(() => {
        const options = {
          double_mode: "success"
        };
        result = validateOptions(options);
      });

      it("should return true", () => {
        expect(result).toBe(true);
      });
    });

    describe("When given invalid double_mode", () => {
      const invalidDoubleModes = [
        1233,
        [],
        {},
        false,
        null,
        undefined,
        "thing"
      ];
      invalidDoubleModes.forEach(double_mode => {
        result = validateOptions({ double_mode });
        expect(result).not.toBe(true);
      });
    });

    describe("When given valid new", () => {
      beforeEach(() => {
        const options = {
          new: "true"
        };
        result = validateOptions(options);
      });

      it("should return true", () => {
        expect(result).toBe(true);
      });
    });

    describe("When given invalid new", () => {
      const invalidNew = [
        1233,
        [],
        {},
        false,
        null,
        undefined,
        "normal string"
      ];
      invalidNew.forEach(newOption => {
        result = validateOptions({ new: newOption });
        expect(result).not.toBe(true);
      });
    });

    describe("When given valid fields", () => {
      beforeEach(() => {
        const options = {
          fields: ["establishment"]
        };
        result = validateOptions(options);
      });

      it("should return true", () => {
        expect(result).toBe(true);
      });
    });

    describe("When given invalid fields", () => {
      const invalidFields = [
        1233,
        ["invalid"],
        {},
        false,
        null,
        undefined,
        "thing"
      ];
      invalidFields.forEach(fields => {
        result = validateOptions({ fields });
        expect(result).not.toBe(true);
      });
    });

    describe("When given valid collected", () => {
      beforeEach(() => {
        const options = {
          collected: "true"
        };
        result = validateOptions(options);
      });

      it("should return true", () => {
        expect(result).toBe(true);
      });
    });

    describe("When given invalid collected", () => {
      const invalidCollected = [
        1233,
        ["invalid"],
        {},
        false,
        null,
        undefined,
        "thing"
      ];
      invalidCollected.forEach(collected => {
        result = validateOptions({ collected });
        expect(result).not.toBe(true);
      });
    });
  });
});
