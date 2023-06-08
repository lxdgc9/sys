import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { PermGrp } from "../../models/perm-gr";

export const getPermGrp: RequestHandler = async (req, res, next) => {
  try {
    const permGrp = await PermGrp.findById(req.params.id).populate({
      path: "perms",
      select: "-perm_grp",
    });
    if (!permGrp) {
      throw new NotFoundErr("perm group not found");
    }

    res.json(permGrp);
  } catch (e) {
    next(e);
  }
};
