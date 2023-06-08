import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { School } from "../../models/school";

export const createSchool: RequestHandler = async (req, res, next) => {
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

  try {
    if (await School.exists({ code })) {
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

    res.status(201).json(newSchool);
  } catch (e) {
    next(e);
    if (req.file) {
      rmSync(req.file.path);
    }
  }
};
