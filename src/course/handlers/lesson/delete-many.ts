import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

export const delManyLesson: RequestHandler = async (req, res, next) => {
  const ids = Array.from(new Set(req.body));

  try {
    const lessons = await Lesson.find({
      _id: { $in: ids },
    });
    if (lessons.length < ids.length) {
      throw new BadReqErr("ids mismatch");
    }

    await Lesson.deleteMany({
      _id: { $in: ids },
    });

    res.sendStatus(204);

    lessons.forEach((el) => {
      el.files.forEach((el) => {
        rmSync(el.path.replace("/api/courses", ""));
      });
    });

    await Course.updateMany(
      {
        lessons: { $in: ids },
      },
      {
        $pullAll: {
          lessons: ids,
        },
      }
    );
  } catch (e) {
    next(e);
  }
};
