import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Course } from "../../models/course";

export const getCourse: RequestHandler = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new BadReqErr("course not found");
    }
    res.json({ course });
  } catch (e) {
    next(e);
  }
};
