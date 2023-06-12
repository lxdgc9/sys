import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../models/class";

export const getClass: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findById(req.params.id).populate([
      {
        path: "school",
        select: "-classes",
      },
      {
        path: "members",
        select: "-classes",
      },
    ]);
    if (!_class) {
      throw new NotFoundErr("Class not found");
    }

    res.json(_class);
  } catch (e) {
    next(e);
  }
};
