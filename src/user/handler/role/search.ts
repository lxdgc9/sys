import { RequestHandler } from "express";
import { Role } from "../../model/role";

export const searchRoles: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      roles: await Role.find().populate({
        path: "perms",
        select: "-group",
      }),
    });
  } catch (e) {
    next(e);
  }
};
