import { RequestHandler } from "express";
import { User } from "../../models/user";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";

const readCourses: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id })
      .lean()
      .select("courses")
      .populate({
        path: "courses.course",
        select: "-classes",
        populate: [
          { path: "author", select: "-role -spec_rules" },
          { path: "lessons" },
        ],
      });
    if (!user) {
      throw new BadReqErr("Invalid token");
    }

    res.json(user.courses);
  } catch (e) {
    next(e);
  }
};

export default readCourses;
