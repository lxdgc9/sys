import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { User } from "../../models/user";

const readMyClasses: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id }).populate({
      path: "classes",
      select: "-courses -members",
      populate: {
        path: "school",
        select: "-classes -members",
      },
    });
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    res.json(user.classes);
  } catch (e) {
    next(e);
  }
};

export default readMyClasses;
