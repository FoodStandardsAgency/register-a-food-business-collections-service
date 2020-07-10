const cls = require("cls-hooked");
const appInsights = require("applicationinsights");
const morgan = require("morgan");
const packageJson = require("../package.json");

if (
  "APPINSIGHTS_INSTRUMENTATIONKEY" in process.env &&
  process.env["APPINSIGHTS_INSTRUMENTATIONKEY"] !== ""
) {
  appInsights.setup().start();
  appInsights.defaultClient.addTelemetryProcessor((envelope) => {
    envelope.tags["ai.cloud.role"] = packageJson.name;
  });
}

const clsNamespace = cls.createNamespace("application");
const { v5 } = require("uuid");
const clsMiddleware = (req, res, next) => {
  // req and res are event emitters. We want to access CLS context inside of their event callbacks
  clsNamespace.bind(req);
  clsNamespace.bind(res);

  clsNamespace.run(() => {
    clsNamespace.set("requestId", v5.DNS);

    next();
  });
};

const { logger } = require("./services/winston");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const { routers } = require("./api/routers");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 4001;

app.use(clsMiddleware);
app.use(helmet());
app.use(bodyParser.json());
app.use("/", routers());
app.use(errorHandler);
app.use(morgan("combined", { stream: logger.stream }));

app.listen(port, () => {
  logger.info(`Collections service started listening on port ${port}`);
});
