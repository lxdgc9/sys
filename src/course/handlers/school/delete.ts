import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { School } from "../../models/school";
import { rmSync } from "fs";

export const delSchool: RequestHandler = async (req, res, next) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      throw new BadReqErr("school not found");
    }
    if (school.classes.length) {
      throw new BadReqErr("found dependent");
    }

    await school.deleteOne();

    if (school.logo) {
      rmSync(school.logo.replace("/api/courses/", ""));
    }

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
