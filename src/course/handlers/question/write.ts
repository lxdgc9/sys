import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { Course } from "../../models/course";
import { Question } from "../../models/question";

const writeQuestion: RequestHandler = async (req, res, next) => {
  const {
    content,
    course_id,
    type,
    difficult,
    has_many_ans,
    answers,
  }: {
    content: string;
    course_id: Types.ObjectId;
    type: string;
    difficult: number;
    has_many_ans: boolean;
    answers:
      | {
          content: string;
          is_correct: boolean;
        }[]
      | string;
  } = req.body;

  try {
    const [user, hasCourse] = await Promise.all([
      User.findOne({ user_id: req.user?.id }),
      Course.exists({ _id: course_id }),
    ]);
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }
    if (!hasCourse) {
      throw new BadReqErr("Course not found");
    }

    const nQuestion = new Question({
      content,
      course: course_id,
      created_by: user._id,
      type,
      difficult,
      has_many_ans,
      answers,
    });
    await nQuestion.save();
    await nQuestion.populate([
      {
        path: "course",
        select: "-classes",
        populate: [
          {
            path: "author",
            select: "-schools -classes -courses -created_courses",
          },
          {
            path: "lessons",
          },
        ],
      },
      {
        path: "created_by",
        select: "-classes -created_courses -courses -schools",
      },
    ]);

    res.status(201).json(nQuestion);
  } catch (e) {
    next(e);
  }
};

export default writeQuestion;
