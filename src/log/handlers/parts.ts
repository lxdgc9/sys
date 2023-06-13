import { RequestHandler } from "express";
import mongoose from "mongoose";

const readParts: RequestHandler = async (_req, res, next) => {
  try {
    const parts = (
      await mongoose.connection.db.listCollections().toArray()
    ).map((part) => part.name);

    res.json(parts);
  } catch (e) {
    next(e);
  }
};

export default readParts;
