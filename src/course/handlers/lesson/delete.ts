import fs from "fs";
import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

const delLesson: RequestHandler = async (req, res, next) => {
  try {
    const hasLesson = await Lesson.exists({ _id: req.params.id });
    if (!hasLesson) {
      throw new BadReqErr("Lesson not found");
    }

    const lesson = await Lesson.findByIdAndDelete(req.params.id).lean();
    res.sendStatus(204);

    lesson!.files.forEach((el) => {
      fs.rmSync(el.path.replace("/api/courses", ""));
    });

    await Course.findByIdAndUpdate(lesson!.course_id, {
      $pull: {
        lessons: lesson!._id,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default delLesson;
