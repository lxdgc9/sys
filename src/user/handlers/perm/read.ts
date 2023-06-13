import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Perm } from "../../models/perm";

const readPerm: RequestHandler = async (req, res, next) => {
  try {
    const perm = await Perm.findById(req.params.id).lean().populate({
      path: "perm_group",
      select: "-items",
    });
    if (!perm) {
      throw new NotFoundErr("Permission not found");
    }

    res.json(perm);
  } catch (e) {
    next(e);
  }
};

export default readPerm;
