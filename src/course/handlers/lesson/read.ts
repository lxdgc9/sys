import { RequestHandler } from "express";
import { Lesson } from "../../models/lesson";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";

const readLesson: RequestHandler = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new BadReqErr("Lesson not found");
    }

    res.json(lesson);
  } catch (e) {
    next(e);
  }
};

export default readLesson;
