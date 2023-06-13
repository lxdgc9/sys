import { RequestHandler } from "express";
import { PermGroup } from "../../models/perm-group";

const readPerms: RequestHandler = async (_req, res, next) => {
  try {
    const perms = await PermGroup.find().lean().populate({
      path: "items",
      select: "-perm_group",
    });

    res.json(perms);
  } catch (e) {
    next(e);
  }
};

export default readPerms;
