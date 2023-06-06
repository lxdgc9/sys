import { RequestHandler } from "express";
import { Role } from "../../models/role";

export const readItems: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      items: await Role.find().populate({
        path: "perms",
        select: "-perm_grp",
      }),
    });
  } catch (e) {
    next(e);
  }
};
