import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../models/class";
import { Course } from "../../models/course";

export const createCourse: RequestHandler = async (req, res, next) => {
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
    const classCount = await Class.countDocuments({
      _id: { $in: cids },
    });
    if (classCount < cids.length) {
      throw new BadReqErr("class_ids mismatch");
    }

    const newCourse = new Course({
      title,
      content,
      author: req.user?.id,
      is_publish,
      classes: cids,
    });
    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (e) {
    next(e);
  }
};
