import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Perm } from "../../models/perm";

export const readPerm: RequestHandler = async (req, res, next) => {
  try {
    const perm = await Perm.findById(req.params.id).populate({
      path: "perm_set",
      select: "-items",
    });
    if (!perm) {
      throw new NotFoundErr("permission not found");
    }
    res.json(perm);
  } catch (e) {
    next(e);
  }
};
