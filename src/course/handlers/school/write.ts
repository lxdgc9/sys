import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { School } from "../../models/school";

export const writeItem: RequestHandler = async (req, res, next) => {
  const item: {
    code: string;
    name: string;
    addr: string;
  } = req.body;

  try {
    if (await School.exists({ code: item.code })) {
      throw new ConflictErr("duplicate code");
    }

    const nItem = new School(item);
    await nItem.save();

    res.status(201).json({ item: nItem });
  } catch (e) {
    next(e);
  }
};
