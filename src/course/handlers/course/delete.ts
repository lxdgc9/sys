import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Course } from "../../models/course";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await Course.findByIdAndDelete(req.params.id);
    if (!item) {
      throw new BadReqErr("course not found");
    }
    res.json({ course: item });
  } catch (e) {
    next(e);
  }
};
