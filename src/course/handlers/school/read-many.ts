import { RequestHandler } from "express";
import { School } from "../../models/school";

export const getSchools: RequestHandler = async (_req, res, next) => {
  try {
    res.json(
      await School.find().populate({
        path: "classes",
        select: "-school -members",
      })
    );
  } catch (e) {
    next(e);
  }
};
