import { RequestHandler } from "express";
import { PermGroup } from "../../models/perm-group";

const readPermGroups: RequestHandler = async (_req, res, next) => {
  try {
    const groups = await PermGroup.find().lean().select("-perms");
    res.json(groups);
  } catch (e) {
    next(e);
  }
};

export default readPermGroups;
