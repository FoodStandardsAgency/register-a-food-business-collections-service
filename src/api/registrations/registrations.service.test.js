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
          collected: true
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
        "false",
        null,
        undefined,
        "thing"
      ];
      invalidCollected.forEach(collected => {
        result = validateOptions({ collected });
        expect(result).not.toBe(true);
      });
    });

    describe("When given valid before", () => {
      const validBefore = [
        "2019-03-15T15:53:40Z",
        "2019-03-15",
        "2019-03-15T15:00:00.000",
        "2020-02-29T00:01:02.132Z",
        "2020-06-30 23:15:00"
      ];

      validBefore.forEach(before => {
        result = validateOptions({ before });
        expect(result).toBe(true);
      });
    });

    describe("When given invalid before", () => {
      const invalidBefore = [
        1233979468,
        ["invalid"],
        {},
        "false",
        null,
        undefined,
        "thing",
        "2019-02-29T00:01:02.132Z",
        "2020-02-30",
        "2020-06-30 00:61:00",
        "2020-06-30 7:1:8",
        "20-6-1"
      ];
      invalidBefore.forEach(before => {
        result = validateOptions({ before });
        expect(result).not.toBe(true);
      });
    });

    describe("When given valid after", () => {
      const validAfter = [
        "2019-03-15T15:53:40Z",
        "2019-03-15",
        "2019-03-15T15:00:00.000",
        "2020-02-29T00:01:02.132Z",
        "2020-06-30 23:15:00"
      ];

      validAfter.forEach(after => {
        result = validateOptions({ after });
        expect(result).toBe(true);
      });
    });

    describe("When given invalid after", () => {
      const invalidAfter = [
        1233979468,
        ["invalid"],
        {},
        "false",
        null,
        undefined,
        "thing",
        "2019-02-29T00:01:02.132Z",
        "2020-02-30",
        "2020-06-30 00:61:00",
        "2020-06-30 7:1:8",
        "20-6-1"
      ];
      invalidAfter.forEach(after => {
        result = validateOptions({ after });
        expect(result).not.toBe(true);
      });
    });

    describe("When given a valid range (no longer than 7 days)", () => {
      const options = {
        after: "2019-01-15T12:00:00",
        before: "2019-01-22T12:00:00"
      };

      result = validateOptions(options);
      expect(result).toBe(true);
    });

    describe("When given an invalid range (longer than 7 days)", () => {
      const options = {
        after: "2019-01-15T12:00:00",
        before: "2019-01-22T12:00:01"
      };

      result = validateOptions(options);
      expect(result).not.toBe(true);
    });
  });
});
