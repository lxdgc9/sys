import { RequestHandler } from "express";
import { connection } from "mongoose";

export const readParts: RequestHandler = async (_req, res, next) => {
  try {
    const parts = (await connection.db.listCollections().toArray()).map(
      (part) => part.name
    );

    res.json(parts);
  } catch (e) {
    next(e);
  }
};
