import fs from "fs";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const deleteSchools: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const schools = await School.find({ _id: { $in: ids } });
    if (schools.length < ids.length) {
      throw new BadReqErr("Invalid ids");
    }
    if (schools.some((el) => el.members.length > 0 || el.classes.length > 0)) {
      throw new BadReqErr("Found dependent");
    }

    await School.deleteMany({ _id: { $in: ids } });
    res.sendStatus(204);

    schools.forEach((el) => {
      if (el.logo) {
        fs.rmSync(el.logo.replace("/api/courses/", ""), { force: true });
      }
    });
  } catch (e) {
    next(e);
  }
};

export default deleteSchools;
