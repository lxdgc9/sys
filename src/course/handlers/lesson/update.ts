import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

const modifyLesson: RequestHandler = async (req, res, next) => {
  const {
    course_id,
    title,
    content,
  }: {
    course_id: Types.ObjectId | undefined;
    title: string | undefined;
    content: string | undefined;
  } = req.body;

  if (req.files) {
    console.log(req.files);
  } else {
    console.log("No files");
  }

  try {
    if (
      course_id === undefined &&
      title === undefined &&
      content === undefined
    ) {
      throw new BadReqErr("Missing fields");
    }

    const course = await Course.findById(course_id);
    if (!course) {
      throw new BadReqErr("Course not found");
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new BadReqErr("Lesson not found");
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

    await Lesson.findById(lesson._id);
    res.json(lesson);
  } catch (e) {
    next(e);
  }
};

export default modifyLesson;
