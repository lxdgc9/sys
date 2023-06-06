import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { School } from "../../models/school";

export const delItems: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = Array.from(new Set(req.body));

  try {
    const items = await School.find({
      _id: { $in: ids },
    });
    if (items.length < ids.length) {
      throw new BadReqErr("items mismatch");
    }
    if (items.some((el) => el.classes.length)) {
      throw new BadReqErr("found dependent");
    }

    await School.deleteMany({
      _id: { $in: ids },
    });

    res.json({ msg: "ok" });
  } catch (e) {
    next(e);
  }
};
