import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { School } from "../../model/school";

export const deleteSchool: RequestHandler = async (req, res, next) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      throw new BadReqErr("school not found");
    }

    res.json({ msg: "deleted" });

    if (school.logo) {
      rmSync(school.logo.replace("/api/courses/", ""));
    }
  } catch (e) {
    next(e);
  }
};
