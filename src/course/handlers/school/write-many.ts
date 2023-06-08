import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { School } from "../../models/school";

export const createSchools: RequestHandler = async (req, res, next) => {
  const items: {
    code: string;
    name: string;
    addr: string;
  }[] = req.body;

  const codes = Array.from(new Set(items.map((el) => el.code)));

  try {
    if (
      codes.length < items.length ||
      (await School.exists({ code: { $in: codes } }))
    ) {
      throw new ConflictErr("duplicate code");
    }

    const schools = await School.insertMany(items);

    res.status(201).json(schools);
  } catch (e) {
    next(e);
  }
};
