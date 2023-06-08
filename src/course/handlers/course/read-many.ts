import { RequestHandler } from "express";
import { Course } from "../../models/course";

export const getCourses: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await Course.find().populate("classes"));
  } catch (e) {
    next(e);
  }
};
