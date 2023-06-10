import { RequestHandler } from "express";
import { PermGroup } from "../../models/perm-group";

export const readPerms: RequestHandler = async (_req, res, next) => {
  try {
    const perms = await PermGroup.find().populate({
      path: "perm_group",
      select: "-items",
    });
    res.json(perms);
  } catch (e) {
    next(e);
  }
};
