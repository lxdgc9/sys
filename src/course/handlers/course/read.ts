import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";

const readCourse: RequestHandler = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) {
      throw new BadReqErr("Course not found");
    }
    res.json(course);
  } catch (e) {
    next(e);
  }
};

export default readCourse;
