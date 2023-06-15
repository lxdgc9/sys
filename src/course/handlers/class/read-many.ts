import { RequestHandler } from "express";
import { Class } from "../../models/class";

const readClasses: RequestHandler = async (_req, res, next) => {
  try {
    const classes = await Class.find()
      .lean()
      .populate([
        {
          path: "school",
          select: "-classes",
        },
        {
          path: "members",
          select: "-classes -courses",
        },
      ]);

    res.json(classes);
  } catch (e) {
    next(e);
  }
};

export default readClasses;
