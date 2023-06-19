import fs from "fs";
import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Types } from "mongoose";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

const deleteLessons: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const lessons = await Lesson.find({ _id: { $in: ids } });
    if (lessons.length < ids.length) {
      throw new BadReqErr("Invalids ids");
    }

    await Lesson.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);

    lessons.forEach((el) => {
      el.files.forEach((el) => {
        fs.rmSync(el.path.replace("/api/courses", ""), { force: true });
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

export default deleteLessons;
