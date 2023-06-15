import fs from "fs";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const delSchools: RequestHandler = async (req, res, next) => {
  const ids = [...new Set(req.body)] as Types.ObjectId[];

  try {
    const schools = await School.find({
      _id: { $in: ids },
    }).lean();
    if (schools.length < ids.length) {
      throw new BadReqErr("Danh sách trường học không hợp lệ");
    }
    if (schools.some((el) => el.classes.length > 0)) {
      throw new BadReqErr("Tồn tại sự phụ thuộc");
    }

    await School.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);

    schools.forEach((el) => {
      if (el.logo) {
        fs.rmSync(el.logo.replace("/api/courses/", ""));
      }
    });
  } catch (e) {
    next(e);
  }
};

export default delSchools;
