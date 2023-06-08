import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

export const deleteLesson: RequestHandler = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new BadReqErr("lesson not found");
    }

    await lesson.deleteOne();

    res.sendStatus(204);

    lesson.files.forEach((el) => {
      rmSync(el.path.replace("/api/courses", ""));
    });

    await Course.findByIdAndUpdate(lesson.course_id, {
      $pull: {
        lessons: lesson._id,
      },
    });
  } catch (e) {
    next(e);
  }
};
