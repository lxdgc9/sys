import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";
import { Class } from "../../models/class";

const modifyCourse: RequestHandler = async (req, res, next) => {
  const {
    title,
    content,
    is_publish,
    class_ids,
  }: {
    title: string;
    content: string;
    is_publish: boolean;
    class_ids: Types.ObjectId[];
  } = req.body;

  const classIds = [...new Set(class_ids)];

  try {
    const [course, classCount] = await Promise.all([
      Course.findById(req.params.id),
      Class.countDocuments({
        _id: { $in: classIds },
      }),
    ]);
    if (!course) {
      throw new BadReqErr("Course not found");
    }
    if (class_ids && classCount < classIds.length) {
      throw new BadReqErr("Classes mismatch");
    }

    await course.updateOne({
      $set: {
        title,
        content,
        is_publish,
        class_ids: classIds,
      },
    });
    res.json(await Course.findById(course._id));
  } catch (e) {
    next(e);
  }
};

export default modifyCourse;
