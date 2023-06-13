import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";
import { Course } from "../../models/course";

const writeCourse: RequestHandler = async (req, res, next) => {
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
    const numClasses = await Class.countDocuments({
      _id: { $in: classIds },
    });
    if (numClasses < classIds.length) {
      throw new BadReqErr("Classes mismatch");
    }

    const nCourse = new Course({
      title,
      content,
      author: req.user!.id,
      is_publish,
      classes: classIds,
    });
    await nCourse.save();
    res.status(201).json(nCourse);
  } catch (e) {
    next(e);
  }
};

export default writeCourse;
