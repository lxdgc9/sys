import { RequestHandler } from "express";
import { Class } from "../../../model/class";

export const searchClasses: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      classes: await Class.find().populate({
        path: "school",
        select: "-classes",
      }),
    });
  } catch (e) {
    next(e);
  }
};
