import { RequestHandler } from "express";
import { Class } from "../../models/class";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";

const readCourseByClass: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findById(req.params.id).populate("courses");
    if (!_class) {
      throw new NotFoundErr("Class not found");
    }

    res.json(_class.courses);
  } catch (e) {
    next(e);
  }
};

export default readCourseByClass;
