import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { School } from "../../model/school";

export const modUnit: RequestHandler = async (req, res, next) => {
  const {
    code,
    name,
    addr,
    desc,
  }: {
    code?: string;
    name?: string;
    addr?: string;
    desc?: string;
  } = req.body;
  try {
    const unit = await School.findById(req.params.id);
    if (!unit) {
      throw new BadReqErr("unit not found");
    }

    if (code !== unit.code && (await School.findOne({ code }))) {
      throw new ConflictErr("duplicate code");
    }

    await unit.updateOne({
      $set: {
        code,
        name,
        addr,
        desc,
        logo: req.file && `/api/courses/${req.file?.path}`,
      },
    });

    if (req.file && unit.logo) {
      rmSync(unit.logo.replace("/api/courses/", ""), {
        force: true,
      });
    }

    const detail = await School.findById(unit._id);

    res.json({ unit: detail });
  } catch (e) {
    next(e);
  }
};
