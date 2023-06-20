import { RequestHandler } from "express";
import { User } from "../../models/user";
import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";

const readMyCourses: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id });
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }
  } catch (e) {
    next(e);
  }
};

export default readMyCourses;
