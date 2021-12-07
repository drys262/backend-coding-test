/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

const handler = (req: Request, res: Response) => {
  res.send({ message: "Healthy" });
};

export default [handler];
