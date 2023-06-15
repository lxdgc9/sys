import { RequestHandler } from "express";
import { Catalog } from "../../models/rule-catalog";

const readPerms: RequestHandler = async (_req, res, next) => {
  try {
    const perms = await Catalog.find().lean().populate({
      path: "items",
      select: "-perm_group",
    });

    res.json(perms);
  } catch (e) {
    next(e);
  }
};

export default readPerms;
