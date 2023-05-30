import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

export const searchGroup: RequestHandler = async (req, res, next) => {
  try {
    const group = await PermGr.findById(req.params.id).populate({
      path: "perms",
      select: "-group",
    });
    if (!group) {
      throw new NotFoundErr("group not found");
    }

    res.json({ group });
  } catch (e) {
    next(e);
  }
};
