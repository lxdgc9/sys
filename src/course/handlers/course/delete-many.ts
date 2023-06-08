import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";
import { RequestHandler } from "express";

export const delCourses: RequestHandler = async (req, res, next) => {
  const ids = Array.from(new Set(req.body));

  try {
    const courseCount = await Course.countDocuments({
      _id: { $in: ids },
    });
    if (courseCount < ids.length) {
      throw new BadReqErr("ids mismatch");
    }

    await Course.deleteMany({
      _id: { $in: ids },
    });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
