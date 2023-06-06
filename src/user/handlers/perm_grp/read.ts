import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { PermGrp } from "../../models/perm-gr";

export const readItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await PermGrp.findById(req.params.id).populate({
      path: "perms",
      select: "-perm_grp",
    });
    if (!item) {
      throw new NotFoundErr("item not found");
    }

    res.json({ item });
  } catch (e) {
    next(e);
  }
};
