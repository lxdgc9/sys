import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Course } from "../../models/course";

export const delCourse: RequestHandler = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      throw new BadReqErr("course not found");
    }
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
