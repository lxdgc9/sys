import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";

const deleteCourses: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const numCourses = await Course.countDocuments({
      _id: { $in: ids },
    });
    if (numCourses < ids.length) {
      throw new BadReqErr("Invalid ids");
    }

    await Course.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default deleteCourses;
