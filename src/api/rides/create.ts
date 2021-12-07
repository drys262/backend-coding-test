/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import executeSqlQuery from "../../library/executeSqlQuery";

const validations = [
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
    .withMessage("End latitude must be between -90 - 90 degrees respectively"),
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
];

const handler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), status: "FAILED" });
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

  const db = req.app.get("db");

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
};

export default [...validations, handler];
