/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import executeSqlQuery from "../../library/executeSqlQuery";

const validations = [
  query("pageNumber")
    .optional()
    .isInt()
    .withMessage("Page number should be an integer"),
  query("pageSize")
    .optional()
    .isInt()
    .withMessage("Page size should be an integer"),
];

const handler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), status: "FAILED" });
  }

  const query = req.query;

  if (!query) return;

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

  const db = req.app.get("db");

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
    console.log('error here', error);
    return res.send({
      error_code: "SERVER_ERROR",
      message: "Unknown error",
    });
  }
};

export default [...validations, handler];
