import { RequestHandler } from "express";
import { connection } from "mongoose";

export const searchParts: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      parts: (await connection.db.listCollections().toArray()).map(
        (c) => c.name
      ),
    });
  } catch (e) {
    next(e);
  }
};
