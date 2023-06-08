import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../models/class";

export const getClass: RequestHandler = async (req, res, next) => {
  try {
    const item = await Class.findById(req.params.id).populate([
      {
        path: "school",
        select: "-classes",
      },
      {
        path: "members",
        select: "-classes",
      },
    ]);
    if (!item) {
      throw new NotFoundErr("item not found");
    }

    res.json(item);
  } catch (e) {
    next(e);
  }
};
