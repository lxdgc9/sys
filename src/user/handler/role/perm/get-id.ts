import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Perm } from "../../../model/perm";

export const getPermById: RequestHandler = async (req, res, next) => {
  try {
    const perm = await Perm.findById(req.params.id).populate({
      path: "group",
      select: "-perms",
    });
    if (!perm) {
      throw new NotFoundErr("permission not found");
    }
    res.json({ perm });
  } catch (e) {
    next(e);
  }
};
