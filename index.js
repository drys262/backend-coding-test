"use strict";

const port = 8010;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

const buildSchemas = require("./src/schemas");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const logger = require('./src/library/logger');
// const swaggerDocument = require("./swagger.json");

db.serialize(async () => {
  await buildSchemas(db);

  const app = require("./src/app")(db);

  const options = {
    apis: ["./src/app.js"],
    definition: {
      info: {
        title: "API Docs",
        version: "1.0.0",
      },
      openapi: "3.0.0",
    }, // files containing annotations as above
  };
  const openapiSpecification = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  app.listen(port, () =>
    logger.info(`App started and listening on port ${port}`)
  );
});