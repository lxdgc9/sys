import { RequestHandler } from "express";
import { School } from "../../models/school";

export const getSchools: RequestHandler = async (_req, res, next) => {
  try {
    const schools = await School.find().populate({
      path: "classes",
      select: "-school -members",
    });

    res.json(schools);
  } catch (e) {
    next(e);
  }
};
