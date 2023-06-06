import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { User } from "../../models/user";

export const getItem: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, "obj");
    if (!user) {
      throw new NotFoundErr("item not found");
    }

    res.json({ user });
  } catch (e) {
    next(e);
  }
};
