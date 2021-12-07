import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { Database } from 'sqlite3';

const app = express();
const jsonParser = bodyParser.json();

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
  app.post("/rides", jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (
      startLatitude < -90 ||
      startLatitude > 90 ||
      startLongitude < -180 ||
      startLongitude > 180
    ) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message:
          "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      });
    }

    if (
      endLatitude < -90 ||
      endLatitude > 90 ||
      endLongitude < -180 ||
      endLongitude > 180
    ) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message:
          "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      });
    }

    if (typeof riderName !== "string" || riderName.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Rider name must be a non empty string",
      });
    }

    if (typeof driverName !== "string" || driverName.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Driver name must be a non empty string",
      });
    }

    if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Driver vehicle must be a non empty string",
      });
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

    db.run(
      "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values,
      function (err) {
        if (err) {
          return res.send({
            error_code: "SERVER_ERROR",
            message: "Unknown error",
          });
        }

        db.all(
          "SELECT * FROM Rides WHERE rideID = ?",
          this.lastID,
          function (err, rows) {
            if (err) {
              return res.send({
                error_code: "SERVER_ERROR",
                message: "Unknown error",
              });
            }

            res.send(rows);
          }
        );
      }
    );
  });

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
  app.get("/rides", (req, res) => {
    const query = req.query;

    const defaultPageSize = 10;

    let sqlQuery = `SELECT * FROM Rides LIMIT ${query.pageSize ? query.pageSize : defaultPageSize}`;

    if (query.pageNumber) {
      const pageNumber = query.pageNumber as string;
      const parsePageNumber = Number.parseInt(pageNumber);
      const pageSize = query.pageSize ? Number.parseInt(query.pageSize as string) : defaultPageSize;
      const finalPageNumber = (parsePageNumber * pageSize) - pageSize;
      if (parsePageNumber !== 1) {
        sqlQuery += ` OFFSET ${finalPageNumber}`;
      }
    }

    db.all(sqlQuery, function (err, rows) {
      if (err) {
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error",
        });
      }

      if (rows.length === 0) {
        return res.send({
          error_code: "RIDES_NOT_FOUND_ERROR",
          message: "Could not find any rides",
        });
      }

      res.send(rows);
    });
  });

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
  app.get("/rides/:id", (req, res) => {
    db.all(
      `SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
      function (err, rows) {
        if (err) {
          return res.send({
            error_code: "SERVER_ERROR",
            message: "Unknown error",
          });
        }

        if (rows.length === 0) {
          return res.send({
            error_code: "RIDES_NOT_FOUND_ERROR",
            message: "Could not find any rides",
          });
        }

        res.send(rows);
      }
    );
  });

  return app;
};