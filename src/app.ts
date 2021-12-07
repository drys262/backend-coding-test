/* eslint-disable @typescript-eslint/no-explicit-any */
import bodyParser from "body-parser";
import express, { Express } from "express";
import { body, param, query, validationResult } from "express-validator";
import { Database } from "sqlite3";

import executeSqlQuery from "./library/executeSqlQuery";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export default (db: Database): Express => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Ride:
   *       type: object
   *       properties:
   *         rideId:
   *           type: integer
   *           description: Unique identifier of the ride.
   *           example: 1
   *         startLat:
   *           type: integer
   *           description: Start latitude of the ride, values should be in -90 - 90
   *           example: 100
   *         startLong:
   *           type: integer
   *           description: Start longitude of the ride, values should be in -180 - 180
   *           example: 180
   *         endLat:
   *           type: integer
   *           description: End latitude of the ride, values should be in -90 - 90
   *           example: 100
   *         endLong:
   *           type: integer
   *           description: End longitude of the ride, values should be in -180 - 180
   *           example: 180
   *         riderName:
   *           type: string
   *           description: Rider alias
   *           example: 'Dylan'
   *         driverName:
   *           type: string
   *           description: Full name of drive
   *           example: 'Brad Pitt'
   *         driverVehicle:
   *           type: string
   *           description: Driver vehicle
   *           example: 'Vehicle'
   *         created:
   *           type: string
   *           description: The response timestamp
   *           example: '2021-09-14 22:11:58'
   */

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check of the API
   *     description: Health check of the API
   *     responses:
   *       200:
   *         description: Returns an object if server is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: The message returned by the health check
   */
  app.get("/health", (req, res) => res.send({ message: "Healthy" }));

  /**
   * @swagger
   * /rides:
   *   post:
   *     summary: Create a ride
   *     description: Create a ride
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               start_lat:
   *                 type: number
   *                 description: Start latitude of the ride, values should be in -90 - 90
   *                 example: 90
   *               start_long:
   *                 type: number
   *                 description: Start longitude of the ride, values should be in -180 - 180
   *                 example: 100
   *               end_lat:
   *                 type: number
   *                 description: End latitude of the ride, values should be in -90 - 90
   *                 example: 90
   *               end_long:
   *                 type: number
   *                 description: End longitude of the ride, values should be in -180 - 180
   *                 example: 100
   *               rider_name:
   *                 type: string
   *                 description: Rider alias
   *                 example: 'Dylan'
   *               driver_name:
   *                 type: string
   *                 description: Full name of driver
   *                 example: 'Brad Pitt'
   *               driver_vehicle:
   *                 type: string
   *                 description: Driver vehicle
   *                 example: 'Vehicle'
   *     responses:
   *       200:
   *         description: Ride details
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Ride'
   */
  app.post(
    "/rides",
    body("start_lat")
      .isFloat({ max: 90, min: -90 })
      .withMessage(
        "Start latitude must be between -90 - 90 degrees respectively"
      ),
    body("start_long")
      .isFloat({ max: 180, min: -180 })
      .withMessage(
        "Start longitude must be between -180 to 180 degrees respectively"
      ),
    body("end_lat")
      .isFloat({ max: 90, min: -90 })
      .withMessage(
        "End latitude must be between -90 - 90 degrees respectively"
      ),
    body("end_long")
      .isFloat({ max: 180, min: -180 })
      .withMessage(
        "End longitude must be between -180 to 180 degrees respectively"
      ),
    body("rider_name")
      .notEmpty()
      .withMessage("Rider name must be a non empty string"),
    body("driver_name")
      .notEmpty()
      .withMessage("Driver name must be a non empty string"),
    body("driver_vehicle")
      .notEmpty()
      .withMessage("Driver vehicle must be a non empty string"),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), status: "FAILED" });
      }

      const values = [
        req.body.start_lat,
        req.body.start_long,
        req.body.end_lat,
        req.body.end_long,
        req.body.rider_name,
        req.body.driver_name,
        req.body.driver_vehicle,
      ];

      const sqlQuery =
        "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)";

      try {
        const lastId = await executeSqlQuery(db, sqlQuery, "insert", values);
        const secondQuery = `SELECT * FROM Rides WHERE rideID = ?`;
        const results = await executeSqlQuery(db, secondQuery, "query", [lastId]);

        res.send(results);
      } catch (error) {
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error",
        });
      }
    }
  );

  /**
   * @swagger
   * /rides?pageSize={pageSize}&pageNumber={pageNumber}:
   *   get:
   *     summary: Retrieve all rides
   *     description: Retrieve all rides
   *     parameters:
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           description: The number of items to return.
   *       - in: query
   *         name: pageNumber
   *         schema:
   *           type: integer
   *           description: The page you are trying to retrieve (ex. 1, 2, 3)
   *     responses:
   *       200:
   *         description: List of rides
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Ride'
   */
  app.get(
    "/rides",
    query("pageNumber").optional().isInt().withMessage("Page number should be an integer"),
    query("pageSize").optional().isInt().withMessage("Page size should be an integer"),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), status: "FAILED" });
      }

      const query = req.query;

      if (!query) return

      const defaultPageSize = 10;

      const values = [
        query.pageSize
          ? Number.parseInt(query.pageSize as string)
          : defaultPageSize,
      ];
      let sqlQuery = `SELECT * FROM Rides LIMIT ?`;

      if (query.pageNumber) {
        const pageNumber = query.pageNumber as string;
        const parsePageNumber = Number.parseInt(pageNumber);
        const pageSize = query.pageSize
          ? Number.parseInt(query.pageSize as string)
          : defaultPageSize;
        const finalPageNumber = parsePageNumber * pageSize - pageSize;
        if (parsePageNumber !== 1) {
          sqlQuery += " OFFSET ?";
          values.push(finalPageNumber);
        }
      }

      try {
        const results = await executeSqlQuery(db, sqlQuery, "query", values);

        if (results && results.length === 0) {
          return res.send({
            error_code: "RIDES_NOT_FOUND_ERROR",
            message: "Could not find any rides",
          });
        }

        res.send(results);
      } catch (error) {
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error",
        });
      }
    }
  );

  /**
   * @swagger
   * /rides/{id}:
   *   get:
   *     summary: Retrieve a specific ride.
   *     description: Retrieve a specific ride.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the ride to retrieve.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: A single ride
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Ride'
   */
  app.get(
    "/rides/:id",
    param("id").isInt().notEmpty().withMessage("ID is required."),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), status: "FAILED" });
      }

      const sqlQuery = `SELECT * FROM Rides WHERE rideID = ?`;

      const id = req.params && req.params.id;

      try {
        const results = await executeSqlQuery(db, sqlQuery, "query", [id]);

        if (results && results.length === 0) {
          return res.send({
            error_code: "RIDES_NOT_FOUND_ERROR",
            message: "Could not find any rides",
          });
        }

        res.send(results);
      } catch (error) {
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error",
        });
      }
    }
  );

  return app;
};