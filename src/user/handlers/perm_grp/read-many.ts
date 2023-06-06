import { RequestHandler } from "express";
import { PermGrp } from "../../models/perm-gr";

export const readItems: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      items: await PermGrp.find().populate({
        path: "perms",
        select: "-perm_grp",
      }),
    });
  } catch (e) {
    next(e);
  }
};
