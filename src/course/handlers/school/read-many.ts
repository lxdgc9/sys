import { RequestHandler } from "express";
import { School } from "../../models/school";

export const readItems: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      items: await School.find().populate({
        path: "classes",
        select: "-school -members",
      }),
    });
  } catch (e) {
    next(e);
  }
};
