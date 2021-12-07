/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { param, validationResult } from "express-validator";
import executeSqlQuery from "../../library/executeSqlQuery";

const validations = [
  param("id").isInt().notEmpty().withMessage("ID is required."),
];

const handler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), status: "FAILED" });
  }

  const sqlQuery = `SELECT * FROM Rides WHERE rideID = ?`;

  const id = req.params && req.params.id;

  const db = req.app.get("db");

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
};

export default [...validations, handler];
