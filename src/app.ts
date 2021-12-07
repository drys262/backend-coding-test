/* eslint-disable @typescript-eslint/no-explicit-any */
import bodyParser from "body-parser";
import express, { Express } from "express";
import health from "./api/health/health";
import createRide from "./api/rides/create";
import getAllRide from "./api/rides/get-all";
import getRide from "./api/rides/get";
import routes from "./config/routes";
import { Database } from "sqlite3";

const app = express();

export default (db: Database): Express => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.set('db', db);

  app.get(routes.healthCheck, ...health);

  app.post(routes.rides, ...createRide);

  app.get(routes.rides, ...getAllRide);

  app.get(`${routes.rides}/:id`, ...getRide);

  return app;
};
