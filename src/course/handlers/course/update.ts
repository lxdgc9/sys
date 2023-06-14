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
    const [hasCourse, numClasses] = await Promise.all([
      Course.exists({ _id: req.params.id }),
      Class.countDocuments({
        _id: { $in: classIds },
      }),
    ]);
    if (!hasCourse) {
      throw new BadReqErr("Course not found");
    }
    if (class_ids && numClasses < classIds.length) {
      throw new BadReqErr("Classes mismatch");
    }

    const modCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          content,
          is_publish,
          class_ids: classIds,
        },
      },
      { new: true }
    );
    res.json(modCourse);
  } catch (e) {
    next(e);
  }
};

export default modifyCourse;
