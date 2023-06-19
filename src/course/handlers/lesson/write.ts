import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";
import { User } from "../../models/user";

const writeLesson: RequestHandler = async (req, res, next) => {
  const {
    course_id,
    title,
    content,
  }: {
    course_id: Types.ObjectId;
    title: string;
    content: string;
  } = req.body;

  try {
    if (!req.files) {
      throw new BadReqErr("Require files");
    }

    const user = await User.findOne({ user_id: req.user?.id }).select(
      "courses"
    );
    if (!user) {
      throw new BadReqErr("Invalid token");
    }

    const coursesIdsByUser = user.courses.map((el) => el.course);
    if (!coursesIdsByUser.some((el) => el.equals(course_id))) {
      throw new BadReqErr("Invalid course_id");
    }

    const course = await Course.findById(course_id);
    if (!course) {
      throw new NotFoundErr("Course not found");
    }

    const nLesson = new Lesson({
      course_id,
      title,
      content,
      files: (req.files as any).map((f: any) => ({
        path: `/api/courses/${f.path}`,
        filename: f.originalname,
        mime_type: f.mimetype,
      })),
    });
    await nLesson.save();

    res.status(201).json(nLesson);

    await course.updateOne({
      $addToSet: {
        lessons: nLesson._id,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default writeLesson;
