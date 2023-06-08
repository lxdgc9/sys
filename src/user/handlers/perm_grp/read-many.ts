import { RequestHandler } from "express";
import { PermGrp } from "../../models/perm-gr";

export const getManyPermGrp: RequestHandler = async (_req, res, next) => {
  try {
    const permGrps = await PermGrp.find().populate({
      path: "perms",
      select: "-perm_grp",
    });

    res.json(permGrps);
  } catch (e) {
    next(e);
  }
};
