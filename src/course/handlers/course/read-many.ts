import { RequestHandler } from "express";
import { Course } from "../../models/course";

export const readCourses: RequestHandler = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("classes");
    res.json(courses);
  } catch (e) {
    next(e);
  }
};
