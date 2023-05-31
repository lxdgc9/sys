import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { School } from "../../model/school";

export const getUnit: RequestHandler = async (req, res, next) => {
  try {
    const unit = await School.findById(req.params.id).populate({
      path: "classes",
      populate: {
        path: "unit",
        select: "-classes",
      },
    });
    if (!unit) {
      throw new NotFoundErr("unit not found");
    }
    res.json({ unit });
  } catch (e) {
    next(e);
  }
};
