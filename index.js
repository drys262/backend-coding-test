"use strict";

const express = require("express");
const app = express();
const port = 8010;

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

const buildSchemas = require("./src/schemas");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerDocument = require("./swagger.json");

db.serialize(() => {
  buildSchemas(db);

  const app = require("./src/app")(db);

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Docs",
        version: "1.0.0",
      },
    },
    apis: ["./src/app.js"], // files containing annotations as above
  };
  const openapiSpecification = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  app.listen(port, () =>
    console.log(`App started and listening on port ${port}`)
  );
});