import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

const writeLesson: RequestHandler = async (req, res, next) => {
  const {
    course_id,
    title,
    content,
  }: {
    course_id: Types.ObjectId;
    title: string;
    content: string;
  } = req.body;

  try {
    if (!req.files) {
      throw new BadReqErr("Require files");
    }

    const course = await Course.findById(course_id);
    if (!course) {
      throw new BadReqErr("Course not found");
    }

    const nLesson = new Lesson({
      course_id,
      title,
      content,
      files: (req.files as any).map((f: any) => ({
        path: f.path,
        mime_type: f.mimetype,
      })),
    });
    await nLesson.save();

    res.status(201).json(nLesson);

    await course.updateOne({
      $addToSet: {
        lessons: nLesson._id,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default writeLesson;
