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
    course_id?: Types.ObjectId;
    title?: string;
    content?: string;
  } = req.body;

  if (req.files) {
    console.log(req.files);
  } else {
    console.log("No files");
  }

  try {
    if (!course_id && !title && !content) {
      throw new BadReqErr("Missing fields");
    }

    const [hasLesson, hasCourse] = await Promise.all([
      Course.exists({ _id: course_id }),
      Lesson.exists({ _id: req.params.id }),
    ]);
    if (!hasLesson) {
      throw new BadReqErr("Lesson not found");
    }
    if (!hasCourse) {
      throw new BadReqErr("Course not found");
    }

    await Lesson.updateOne({
      $set: {
        course_id,
        title,
        content,
      },
    });

    // await Promise.allSettled([
    //   Course.updateOne({
    //     _id: req.params.id,
    //   }, {
    //     $pull: {
    //       lessons: req.params.._id,
    //     },
    //   }),
    //   course.updateOne({
    //     $addToSet: {
    //       lessons: lesson._id,
    //     },
    //   }),
    // ]);
    //
    // await Lesson.findById(lesson._id);
    // res.json(lesson);
    //
    res.json();
  } catch (e) {
    next(e);
  }
};

export default modifyLesson;
