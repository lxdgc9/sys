import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { School } from "../../model/school";

export const delUnit: RequestHandler = async (req, res, next) => {
  try {
    const unit = await School.findByIdAndDelete(req.params.id);
    if (!unit) {
      throw new BadReqErr("unit not found");
    }

    if (unit.logo) {
      rmSync(unit.logo.replace("/api/courses/", ""));
    }

    res.json({ msg: "deleted unit" });
  } catch (e) {
    next(e);
  }
};
