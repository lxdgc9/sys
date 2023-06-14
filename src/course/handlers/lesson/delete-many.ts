import fs from "fs";
import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Types } from "mongoose";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

const delLessons: RequestHandler = async (req, res, next) => {
  const ids = [...new Set(req.body)] as Types.ObjectId[];

  try {
    const lessons = await Lesson.find({ _id: { $in: ids } }).lean();
    if (lessons.length < ids.length) {
      throw new BadReqErr("Lessons mismatch");
    }

    await Lesson.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);

    lessons.forEach((el) => {
      el.files.forEach((el) => {
        fs.rmSync(el.path.replace("/api/courses", ""));
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

export default delLessons;
