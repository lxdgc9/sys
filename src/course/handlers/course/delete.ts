import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";

const delCourse: RequestHandler = async (req, res, next) => {
  try {
    const result = await Course.deleteOne({
      _id: req.params.id,
    });
    if (!result) {
      throw new BadReqErr("Course not found");
    }
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default delCourse;
