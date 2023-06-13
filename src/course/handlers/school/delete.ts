import fs from "fs";
import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const delSchool: RequestHandler = async (req, res, next) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      throw new BadReqErr("School not found");
    }
    if (school.classes.length > 0) {
      throw new BadReqErr("Found dependent");
    }

    await school.deleteOne();
    res.sendStatus(204);

    if (school.logo_url) {
      fs.rmSync(school.logo_url.replace("/api/courses/", ""));
    }
  } catch (e) {
    next(e);
  }
};

export default delSchool;
