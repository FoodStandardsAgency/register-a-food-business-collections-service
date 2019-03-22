const { Router } = require("express");
const { logEmitter } = require("../../services/logging.service");
const {
  getRegistrationsByCouncil,
  getRegistration,
  getRegistrations,
  updateRegistration,
  updateRegistrationForUnified,
  updateAllRegistrationsForUnified
} = require("./registrations.controller");

const registrationsRouter = () => {
  const router = Router();

  router.get("/all", async (req, res, next) => {
    logEmitter.emit("functionCall", "registrations.router", "GET /all route");
    try {
      let registrations;
      const options = {
        double_mode: req.headers["double-mode"] || "",
        newForLA: req.query.newForLA || "false",
        newForUV: req.query.newForUV || "true",
        before: req.query.before || new Date().toISOString()
      };

      registrations = await getRegistrations(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "GET /all route"
      );
      res.send(registrations);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "GET /all route",
        err
      );
      next(err);
    }
  });

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

      registrations = await getRegistrationsByCouncil(options);

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

  router.put("/all/:fsa_rn", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.router",
      "PUT /all/:fsa_rn route"
    );
    try {
      const options = {
        double_mode: req.headers["double-mode"] || "",
        collected: req.body.collected,
        fsa_rn: req.params.fsa_rn
      };

      const response = await updateRegistrationForUnified(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "PUT /all/:fsa_rn route"
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

  router.put("/all", async (req, res, next) => {
    logEmitter.emit("functionCall", "registrations.router", "PUT /all route");

    const options = {
      double_mode: req.headers["double-mode"] || "",
      newForLA: req.query.newForLA || "false",
      newForUV: req.query.newForUV || "true",
      before: req.query.before || new Date().toISOString()
    };

    try {
      const response = await updateAllRegistrationsForUnified(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "PUT /all route"
      );
      res.send(response);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "PUT /all route",
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
