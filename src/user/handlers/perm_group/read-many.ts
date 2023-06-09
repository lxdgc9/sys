import { RequestHandler } from "express";
import { PermGroup } from "../../models/perm-group";

export const readPermGroup: RequestHandler = async (_req, res, next) => {
  try {
    const groups = await PermGroup.find().lean().populate({
      path: "items",
      select: "-perm_group",
    });

    res.json(groups);
  } catch (e) {
    next(e);
  }
};
