import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { School } from "../../model/school";

export const insertSchool: RequestHandler = async (req, res, next) => {
  const {
    code,
    name,
    addr,
    desc,
  }: {
    code: string;
    name: string;
    addr?: string;
    desc?: string;
  } = req.body;

  console.log(req.file);

  try {
    const isDupl = await School.exists({ code });
    if (isDupl) {
      throw new ConflictErr("duplicate code");
    }

    const newSchool = new School({
      code,
      name,
      addr,
      desc,
      logo: req.file && `/api/courses/${req.file.path}`,
    });
    await newSchool.save();

    res.status(201).json({ school: newSchool });
  } catch (e) {
    next(e);
    if (req.file) {
      rmSync(req.file.path);
    }
  }
};
