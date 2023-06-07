import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";

export const deleteItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await Lesson.findById(req.params.id);
    if (!item) {
      throw new BadReqErr("item not found");
    }

    await item.deleteOne();

    res.json({ msg: "ok" });

    await Course.findByIdAndUpdate(item.course_id, {
      $pull: {
        lessons: item._id,
      },
    });
  } catch (e) {
    next(e);
  }
};
