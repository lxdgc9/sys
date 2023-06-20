import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";

const readCoursesByClass: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findById(req.params.class_id).populate<{
      courses: {
        is_publish: boolean;
      }[];
    }>({
      path: "courses",
      select: "-classes",
      populate: [
        { path: "author", select: "-role -spec_rules" },
        { path: "lessons" },
      ],
    });
    if (!_class) {
      throw new NotFoundErr("Class not found");
    }

    res.json(_class.courses.filter((el) => el.is_publish));
  } catch (e) {
    next(e);
  }
};

export default readCoursesByClass;
