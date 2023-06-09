import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { PermGroup } from "../../models/perm-group";

export const readPermGroup: RequestHandler = async (req, res, next) => {
  try {
    const group = await PermGroup.findById(req.params.id).lean().populate({
      path: "items",
      select: "-perm_group",
    });
    if (!group) {
      throw new NotFoundErr("permission group not found");
    }

    res.json(group);
  } catch (e) {
    next(e);
  }
};
