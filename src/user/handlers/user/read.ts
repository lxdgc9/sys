import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { User } from "../../models/user";

const readUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate([
      {
        path: "role",
        populate: {
          path: "rules",
          select: "-catalog",
        },
      },
      {
        path: "spec_rules",
        select: "-catalog",
      },
    ]);
    if (!user) {
      throw new NotFoundErr("User not found");
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
};

export default readUser;
