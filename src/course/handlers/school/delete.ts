import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { School } from "../../models/school";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await School.findById(req.params.id);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (item.classes.length) {
      throw new BadReqErr("found dependent");
    }

    await item.deleteOne();

    res.json({ msg: "ok" });
  } catch (e) {
    next(e);
  }
};
