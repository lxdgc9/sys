import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Course } from "../../models/course";
import { Types } from "mongoose";
import { Class } from "../../models/class";

export const updateCourse: RequestHandler = async (req, res, next) => {
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

  const cids = Array.from(new Set(class_ids));

  try {
    const [course, classCount] = await Promise.all([
      Course.findById(req.params.id),
      Class.countDocuments({
        _id: { $in: cids },
      }),
    ]);
    if (!course) {
      throw new BadReqErr("course not found");
    }
    if (class_ids && classCount < cids.length) {
      throw new BadReqErr("class_ids mismatch");
    }

    await course.updateOne({
      $set: {
        title,
        content,
        is_publish,
        class_ids: cids,
      },
    });

    res.json(await Course.findById(course._id));
  } catch (e) {
    next(e);
  }
};
