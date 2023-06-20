import { RequestHandler } from "express";
import { NotFoundErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";

const updateProcess: RequestHandler = async (req, res, next) => {
  const { process }: { process: number } = req.body;

  try {
    const user = await User.findOne({ user_id: req.user?.id });
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    let course = user.courses.find((el) =>
      el.course.equals(req.params.course_id)
    );
    if (!course) {
      throw new NotFoundErr("Invalid course");
    }

    course.process = process;
    await user.updateOne({
      $set: {
        courses: user.courses,
      },
    });

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

export default updateProcess;
