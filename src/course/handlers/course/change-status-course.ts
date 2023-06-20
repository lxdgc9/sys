import { RequestHandler } from "express";
import { BadReqErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { Course } from "../../models/course";

const changeStatusCourse: RequestHandler = async (req, res, next) => {
  const { status }: { status: boolean } = req.body;

  try {
    const user = await User.findOne({ user_id: req.user?.id });
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    if (
      !user.created_courses.some((el) => el._id.equals(req.params.course_id))
    ) {
      throw new BadReqErr("Invalid course");
    }

    await Course.updateOne(
      { _id: req.params.course_id },
      {
        $set: {
          is_publish: status,
        },
      }
    );

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

export default changeStatusCourse;
