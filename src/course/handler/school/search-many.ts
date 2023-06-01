import { RequestHandler } from "express";
import { School } from "../../model/school";

export const searchSchools: RequestHandler = async (req, res, next) => {
  try {
    res.json({
      schools: await School.find().populate({
        path: "classes",
        select: "-school -members",
      }),
    });
  } catch (e) {
    next(e);
  }
};
