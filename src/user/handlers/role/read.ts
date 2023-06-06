import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Role } from "../../models/role";

export const readItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await Role.findById(req.params.id).populate({
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
