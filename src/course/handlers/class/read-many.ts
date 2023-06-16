import { RequestHandler } from "express";
import { Class } from "../../models/class";

const readClasses: RequestHandler = async (_req, res, next) => {
  try {
    const classes = await Class.find()
      .lean()
      .select("-members -courses")
      .populate("school", "-classes -members");

    res.json(classes);
  } catch (e) {
    next(e);
  }
};

export default readClasses;
