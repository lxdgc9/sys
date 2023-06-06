import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { User } from "../../models/user";

export const readItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await User.findById(req.params.id, "obj");
    if (!item) {
      throw new NotFoundErr("item not found");
    }

    res.json({ item });
  } catch (e) {
    next(e);
  }
};
