import { RequestHandler } from "express";
import { User } from "../../models/user";
import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";

const me: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id).populate([
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
      throw new UnauthorizedErr("Invalid token");
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
};

export default me;
