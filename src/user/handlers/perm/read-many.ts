import { RequestHandler } from "express";
import { PermSet } from "../../models/perm-set";

export const readItems: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      items: await PermSet.find().populate({
        path: "perms",
        select: "-perm_grp",
      }),
    });
  } catch (e) {
    next(e);
  }
};
