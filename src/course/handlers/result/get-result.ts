import { RequestHandler } from "express";
import { Class } from "../../models/class";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Result } from "../../models/result";

export const getResult: RequestHandler = async (req, res, next) => {
  try {
    const [_class] = await Promise.all([Class.findById(req.params.class_id)]);
    if (!_class) {
      throw new NotFoundErr("Class not found");
    }

    const docs = await Result.findOne({ class_id: _class._id }).populate(
      "user"
    );

    res.json(docs);
  } catch (e) {
    next(e);
  }
};
