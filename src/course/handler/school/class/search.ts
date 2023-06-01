import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../../model/class";

export const searchClass: RequestHandler = async (req, res, next) => {
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
      throw new NotFoundErr("class not found");
    }

    res.json({ class: _class });
  } catch (e) {
    next(e);
  }
};
