import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

export const searchGroups: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      groups: await PermGr.find().populate({
        path: "perms",
        select: "-group",
      }),
    });
  } catch (e) {
    next(e);
  }
};
