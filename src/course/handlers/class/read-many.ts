import { RequestHandler } from "express";
import { Class } from "../../models/class";

export const getClasses: RequestHandler = async (_req, res, next) => {
  try {
    const classes = await Class.find().select("-members").populate({
      path: "school",
      select: "-classes",
    });

    res.json(classes);
  } catch (e) {
    next(e);
  }
};
