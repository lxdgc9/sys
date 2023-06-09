import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { PermSet as Group } from "../../models/perm-set";

export const readGroup: RequestHandler = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id).populate({
      path: "perms",
      select: "-perm_grp",
    });
    if (!group) {
      throw new NotFoundErr("not found");
    }

    res.json(group);
  } catch (e) {
    next(e);
  }
};
