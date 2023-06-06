import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Perm } from "../../models/perm";

export const readItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await Perm.findById(req.params.id).populate({
      path: "perm_grp",
      select: "-perms",
    });
    if (!item) {
      throw new NotFoundErr("item not found");
    }

    res.json({ item });
  } catch (e) {
    next(e);
  }
};
