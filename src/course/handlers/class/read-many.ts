import { RequestHandler } from "express";
import { Class } from "../../models/class";

export const getClasses: RequestHandler = async (_req, res, next) => {
  try {
    res.json(
      await Class.find({}, "-members").populate({
        path: "school",
        select: "-classes",
      })
    );
  } catch (e) {
    next(e);
  }
};
