import fs from "fs";
import { RequestHandler } from "express";
import { BadReqErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const delSchool: RequestHandler = async (req, res, next) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      throw new NotFoundErr("Không tìm thấy trường học");
    }
    if (school.classes.length > 0) {
      throw new BadReqErr("Có tồn tại sự phụ thuộc");
    }

    await school.deleteOne();
    res.sendStatus(204);

    if (school.logo) {
      fs.rmSync(school.logo.replace("/api/courses/", ""));
    }
  } catch (e) {
    next(e);
  }
};

export default delSchool;
