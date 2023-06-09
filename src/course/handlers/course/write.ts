import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";
import { Course } from "../../models/course";
import { User } from "../../models/user";

const writeCourse: RequestHandler = async (req, res, next) => {
  const {
    title,
    content,
    is_publish,
    class_ids,
  }: {
    title: string;
    content: string;
    is_publish: boolean;
    class_ids: Types.ObjectId[];
  } = req.body;

  try {
    const user = await User.findOne({ user_id: req.user?.id }).select(
      "classes"
    );
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    if (!class_ids.every((el) => user.classes.some((u) => u.equals(el)))) {
      throw new BadReqErr("Invalid class_ids");
    }

    const _classes = await Class.find({ _id: { $in: class_ids } }).select(
      "members"
    );
    const allMember = [...new Set(_classes.map((el) => el.members).flat())];

    const nCourse = new Course({
      title,
      content,
      author: user._id,
      is_publish,
      classes: class_ids,
    });
    await nCourse.save();

    await nCourse.populate([
      { path: "classes", select: "name" },
      {
        path: "author",
        select: "-courses -created_courses -schools -classes",
      },
    ]);

    res.status(201).json(nCourse);

    await Promise.allSettled([
      Class.updateMany(
        { _id: { $in: class_ids } },
        {
          $addToSet: {
            courses: nCourse,
          },
        }
      ),
      User.updateMany(
        { _id: { $in: allMember } },
        {
          $addToSet: {
            courses: {
              course: nCourse,
            },
            created_courses: nCourse,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writeCourse;
