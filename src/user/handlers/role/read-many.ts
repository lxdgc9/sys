import { RequestHandler } from "express";
import { Role } from "../../models/role";

const readRoles: RequestHandler = async (_req, res, next) => {
  try {
    const roles = await Role.find().populate({
      path: "perms",
      select: "-perm_group",
    });

    res.json(roles);
  } catch (e) {
    next(e);
  }
};

export default readRoles;
