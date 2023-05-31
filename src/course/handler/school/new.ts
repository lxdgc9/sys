import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { School } from "../../model/school";

export const newUnit: RequestHandler = async (req, res, next) => {
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
    const isDupl = await School.exists({ code });
    if (isDupl) {
      throw new ConflictErr("duplicate unit");
    }

    const newUnit = new School({
      code,
      name,
      addr,
      desc,
      logo: req.file && `/api/courses/${req.file.path}`,
    });
    await newUnit.save();

    res.status(201).json({ unit: newUnit });
  } catch (e) {
    next(e);
    if (req.file) {
      rmSync(req.file.path);
    }
  }
};
