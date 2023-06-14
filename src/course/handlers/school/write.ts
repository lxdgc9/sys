import fs from "fs";
import { RequestHandler } from "express";
import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const writeSchool: RequestHandler = async (req, res, next) => {
  const {
    code,
    name,
    address,
    description,
  }: {
    code: string;
    name: string;
    address?: string | undefined;
    description?: string | undefined;
  } = req.body;

  try {
    const hasCode = await School.exists({ code });
    if (hasCode) {
      throw new ConflictErr("Duplicate code");
    }

    const nSchool = new School({
      code,
      name,
      address,
      description,
      logo_url: req.file && `/api/courses/${req.file.path}`,
    });
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
