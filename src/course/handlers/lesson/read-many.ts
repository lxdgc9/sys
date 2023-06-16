import { RequestHandler } from "express";
import { Course } from "../../models/course";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";

const readLessonsByCourse: RequestHandler = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.couse_id)
      .lean()
      .populate("lessons");
    if (!course) {
      throw new NotFoundErr("Course not found");
    }

    res.json(course.lessons);
  } catch (e) {
    next(e);
  }
};

export default readLessonsByCourse;
