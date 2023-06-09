import { RequestHandler } from "express";
import { PermSet } from "../../models/perm-set";

export const getManyPermGrp: RequestHandler = async (_req, res, next) => {
  try {
    const permGrps = await PermSet.find().populate({
      path: "perms",
      select: "-perm_grp",
    });

    res.json(permGrps);
  } catch (e) {
    next(e);
  }
};
