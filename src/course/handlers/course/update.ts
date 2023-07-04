import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";
import { Class } from "../../models/class";

const modifyCourse: RequestHandler = async (req, res, next) => {
  let {
    title,
    content,
    is_publish,
    class_ids,
    same_author_ids,
  }: {
    title: string;
    content: string;
    is_publish: boolean;
    class_ids: Types.ObjectId[];
    same_author_ids: Types.ObjectId[];
  } = req.body;

  try {
    const [hasCourse, numClasses] = await Promise.all([
      Course.exists({ _id: req.params.id }),
      Class.countDocuments({
        _id: { $in: class_ids },
      }),
    ]);
    if (!hasCourse) {
      throw new BadReqErr("Course not found");
    }
    if (class_ids && numClasses < class_ids.length) {
      throw new BadReqErr("Classes mismatch");
    }

    same_author_ids.push(req.user!.id);
    same_author_ids = [...new Set(same_author_ids)];

    const modCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          same_authors: same_author_ids,
          content,
          is_publish,
          author: req.user?.id,
          class_ids: class_ids,
        },
      },
      { new: true }
    ).populate({
      path: "created_courses",
      select: "-classes",
      populate: [
        {
          path: "author",
          select: "-schools -classes -created_courses -courses",
        },
        { path: "lessons" },
      ],
    });

    res.json(modCourse);
  } catch (e) {
    next(e);
  }
};

export default modifyCourse;
