import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Perm } from "../../models/perm";

export const readItem: RequestHandler = async (req, res, next) => {
  try {
    const perm = await Perm.findById(req.params.id).populate({
      path: "perm_grp",
      select: "-perms",
    });
    if (!perm) {
      throw new NotFoundErr("item not found");
    }

    res.json({ perm });
  } catch (e) {
    next(e);
  }
};
