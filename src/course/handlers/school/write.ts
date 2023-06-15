import fs from "fs";
import { RequestHandler } from "express";
import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const writeSchool: RequestHandler = async (req, res, next) => {
  const {
    code,
    name,
    info,
  }: {
    code: string;
    name: string;
    info: string;
  } = req.body;

  let logo = "/api/courses/def-logo.jpg";
  if (req.file) {
    logo = `/api/courses/${req.file.path}`;
  }

  try {
    const hasCode = await School.exists({ code });
    if (hasCode) {
      throw new ConflictErr(`Mã trường ${code} đã tồn tại`);
    }

    const nSchool = new School({ code, name, info, logo });
    await nSchool.save();

    res.status(201).json(nSchool);
  } catch (e) {
    next(e);
    if (req.file) {
      fs.rmSync(req.file.path);
    }
  }
};

export default writeSchool;
