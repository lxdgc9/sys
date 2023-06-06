import { RequestHandler } from "express";
import { School } from "../../models/school";

export const readItems: RequestHandler = async (_req, res, next) => {
  try {
    const items = await School.find().populate({
      path: "classes",
      select: "-school -members",
    });

    res.json(items);
  } catch (e) {
    next(e);
  }
};
