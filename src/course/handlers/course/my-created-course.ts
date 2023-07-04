import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";

const readMyCreatedCourses: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id }).populate({
      path: "created_courses",
      select: "-classes",
      populate: [
        {
          path: "author",
          select: "-schools -classes -created_courses -courses",
        },
        {
          path: "lessons",
          populate: {
            path: "author",
          },
        },
        {
          path: "same_authors",
        },
      ],
    });
    if (!user) {
      throw new BadReqErr("Invalid token");
    }

    res.json(user.created_courses);
  } catch (e) {
    next(e);
  }
};

export default readMyCreatedCourses;
