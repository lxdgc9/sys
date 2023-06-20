import { RequestHandler } from "express";
import { User } from "../../models/user";
import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";

const readMySchools: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id }).populate([
      { path: "classes", select: "name" },
      {
        path: "schools",
        populate: [
          { path: "classes", select: "name" },
          {
            path: "members",
            select: "-schools -classes -created_courses -courses",
          },
        ],
      },
    ]);
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    res.json(user.schools);
  } catch (e) {
    next(e);
  }
};

export default readMySchools;
