import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

declare global {
  namespace Express {
    interface Request {
      files?: File[];
    }
  }
}

export const createLesson: RequestHandler = async (req, res, next) => {
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
      throw new BadReqErr("require files");
    }

    const course = await Course.findById(course_id);
    if (!course) {
      throw new BadReqErr("course not found");
    }

    const newLesson = new Lesson({
      course_id,
      title,
      content,
      files: req.files.map((f: any) => ({
        path: f.path,
        mime_type: f.mimetype,
      })),
    });
    await newLesson.save();

    res.status(201).json(newLesson);

    await course.updateOne({
      $addToSet: {
        lessons: newLesson._id,
      },
    });
  } catch (e) {
    next(e);
  }
};
