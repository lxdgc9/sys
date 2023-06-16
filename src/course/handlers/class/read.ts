import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";

const readClass: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findById(req.params.id)
      .lean()
      .populate([
        { path: "school", select: "-classes -members" },
        { path: "members", select: "-classes" },
      ]);
    if (!_class) {
      throw new NotFoundErr("Class not found");
    }

    res.json(_class);
  } catch (e) {
    next(e);
  }
};

export default readClass;
