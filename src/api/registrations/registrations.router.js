const { Router } = require("express");
const { logEmitter } = require("../../services/logging.service");
const {
  getRegistrations,
  getRegistration,
  updateRegistration,
  resetRegistrations
} = require("./registrations.controller");

const registrationsRouter = () => {
  const router = Router();

  router.get("/:lc", async (req, res, next) => {
    logEmitter.emit("functionCall", "registrations.router", "/:lc route");
    try {
      let registrations;
      const fields = req.query.fields ? req.query.fields.split(",") : [];
      const options = {
        double_mode: req.headers["double-mode"] || "",
        new: req.query.new || "true",
        fields,
        council: req.params.lc
      };

      registrations = await getRegistrations(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "GET /:lc route"
      );
      res.send(registrations);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "GET /:lc route",
        err
      );
      next(err);
    }
  });

  router.get("/:lc/:fsa_rn", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.router",
      "GET /:lc/:fsa_rn route"
    );
    try {
      const options = {
        double_mode: req.headers["double-mode"] || "",
        fsa_rn: req.params.fsa_rn,
        council: req.params.lc
      };

      const registration = await getRegistration(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "GET /:lc/:fsa_rn route"
      );
      res.send(registration);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "GET /:lc/:fsa_rn route",
        err
      );
      next(err);
    }
  });

  router.put("/reset/:lc", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.router",
      "PUT /reset/:lc/ route"
    );
    try {
      const options = {
        double_mode: req.headers["double-mode"] || "",
        council: req.params.lc
      };

      const response = await resetRegistrations(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "PUT /reset/:lc/ route"
      );
      res.send(response);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "PUT /reset/:lc/ route",
        err
      );
      next(err);
    }
  });

  router.put("/:lc/:fsa_rn", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.router",
      "PUT /:lc/:fsa_rn route"
    );
    try {
      const options = {
        double_mode: req.headers["double-mode"] || "",
        collected: req.body.collected,
        fsa_rn: req.params.fsa_rn,
        council: req.params.lc
      };

      const response = await updateRegistration(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "PUT /:lc/:fsa_rn route"
      );
      res.send(response);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "PUT /:lc/:fsa_rn route",
        err
      );
      next(err);
    }
  });

  return router;
};

module.exports = { registrationsRouter };
