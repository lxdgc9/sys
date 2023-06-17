import { RequestHandler } from "express";
import { User } from "../../models/user";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";

const readMyCreatedCourses: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id }).lean();
    if (!user) {
      throw new BadReqErr("Invalid token");
    }

    console.log(user);

    res.json(user.courses);
  } catch (e) {
    next(e);
  }
};

export default readMyCreatedCourses;
