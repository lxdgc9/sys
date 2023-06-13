import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";

const readUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, "obj");
    if (!user) {
      throw new NotFoundErr("User not found");
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
};

export default readUser;
