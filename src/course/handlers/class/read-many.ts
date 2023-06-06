import { RequestHandler } from "express";
import { Class } from "../../models/class";

export const readItems: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      classes: await Class.find({}, "-members").populate({
        path: "school",
        select: "-classes",
      }),
    });
  } catch (e) {
    next(e);
  }
};