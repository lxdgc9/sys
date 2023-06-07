import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

export const delItems: RequestHandler = async (req, res, next) => {
  const ids = Array.from(new Set(req.body));

  try {
    const items = await Lesson.find({
      _id: { $in: ids },
    });
    if (items.length < ids.length) {
      throw new BadReqErr("ids mismatch");
    }

    await Lesson.deleteMany({
      _id: { $in: ids },
    });

    res.json({ msg: "ok" });

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
