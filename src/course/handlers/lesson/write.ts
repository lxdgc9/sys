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

export const writeItem: RequestHandler = async (req, res, next) => {
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

    const files = req.files.map((f: any) => ({
      path: f.path,
      mime_type: f.mimetype,
    }));

    const nLesson = new Lesson({
      course_id,
      title,
      content,
      files,
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
