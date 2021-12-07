const port = 8010;

import sqlite3 from 'sqlite3';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const db = new sqlite3.Database(":memory:");
import createApp from './app';
import logger from "./library/logger";
import buildSchemas from "./schemas";

db.serialize(async () => {
  await buildSchemas(db);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = createApp(db);

  const options = {
    apis: ["**/*.ts"],
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