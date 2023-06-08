import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { Types } from "mongoose";
import { School } from "../../models/school";

export const delSchools: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = Array.from(new Set(req.body));

  try {
    const schools = await School.find({
      _id: { $in: ids },
    });
    if (schools.length < ids.length) {
      throw new BadReqErr("schools mismatch");
    }
    if (schools.some((el) => el.classes.length)) {
      throw new BadReqErr("found dependent");
    }

    await School.deleteMany({
      _id: { $in: ids },
    });

    schools.forEach((el) => {
      if (el.logo) {
        rmSync(el.logo.replace("/api/courses/", ""));
      }
    });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
