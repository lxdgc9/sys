import { RequestHandler } from "express";
import { Course } from "../../models/course";

const readCourses: RequestHandler = async (_req, res, next) => {
  try {
    const courses = await Course.find().lean().populate("classes");
    res.json(courses);
  } catch (e) {
    next(e);
  }
};

export default readCourses;
