import { RequestHandler } from "express";
import { PermGroup } from "../../models/perm-group";

export const readPerms: RequestHandler = async (_req, res, next) => {
  try {
    const perms = await PermGroup.find().populate({
      path: "items",
      select: "-perm_set",
    });
    res.json(perms);
  } catch (e) {
    next(e);
  }
};
