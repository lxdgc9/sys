import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Course } from "../../models/course";

export const updateCourse: RequestHandler = async (req, res, next) => {
  const items: {} = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new BadReqErr("course not found");
    }
    res.json({});
  } catch (e) {
    next(e);
  }
};
