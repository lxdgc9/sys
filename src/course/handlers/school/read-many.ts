import { RequestHandler } from "express";
import { School } from "../../models/school";

const readSchools: RequestHandler = async (_req, res, next) => {
  try {
    const schools = await School.find().lean().populate({
      path: "classes",
      select: "-school -members",
    });

    res.json(schools);
  } catch (e) {
    next(e);
  }
};

export default readSchools;
