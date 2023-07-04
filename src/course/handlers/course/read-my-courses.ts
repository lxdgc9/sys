import { RequestHandler } from "express";
import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";

const readMyCourses: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id }).populate<{
      courses: {
        course: {
          is_publish: boolean;
        };
      }[];
    }>({
      path: "courses.course",
      select: "-classes",
      populate: [
        {
          path: "author",
          select: "-schools -classes -courses -created_courses",
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
      throw new UnauthorizedErr("Invalid token");
    }

    // res.json(user.courses.filter((el) => el.course.is_publish));
    res.json(user.courses);
  } catch (e) {
    next(e);
  }
};

export default readMyCourses;
