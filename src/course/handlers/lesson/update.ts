import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

export const updateItem: RequestHandler = async (req, res, next) => {
  const {
    course_id,
    title,
    content,
  }: {
    course_id: Types.ObjectId;
    title: string;
    content: string;
  } = req.body;

  if (req.files) {
    console.log(req.files);
  } else {
    console.log("no files");
  }

  try {
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    const course = await Course.findById(course_id);
    if (!course) {
      throw new BadReqErr("couse not found");
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new BadReqErr("lesson not found");
    }

    await lesson.updateOne({
      $set: {
        course_id,
        title,
        content,
      },
    });

    await Promise.all([
      Course.findByIdAndUpdate(lesson.course_id, {
        $pull: {
          lessons: lesson._id,
        },
      }),
      course.updateOne({
        $addToSet: {
          lessons: lesson._id,
        },
      }),
    ]);

    res.json(await Lesson.findById(lesson._id));
  } catch (e) {
    next(e);
  }
};
