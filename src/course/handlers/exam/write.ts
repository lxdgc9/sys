import { RequestHandler } from "express";
import { Types } from "mongoose";
import {
  ConflictErr,
  NotFoundErr,
  UnauthorizedErr,
} from "@lxdgc9/pkg/dist/err";
import { Exam } from "../../models/examination";
import { Course } from "../../models/course";
import { User } from "../../models/user";

const writeExam: RequestHandler = async (req, res, next) => {
  const {
    title,
    code,
    course_id,
    duration,
    type,
    question_ids,
  }: {
    title: string;
    code: string;
    course_id: Types.ObjectId;
    duration: number;
    type: string;
    question_ids: Types.ObjectId[];
  } = req.body;

  try {
    const [user, hasCourse, isDupl] = await Promise.all([
      User.findOne({ user_id: req.user?.id }),
      Course.exists({ _id: course_id }),
      Exam.exists({ code }),
    ]);
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }
    if (!hasCourse) {
      throw new NotFoundErr("Course not found");
    }
    if (isDupl) {
      throw new ConflictErr("Duplicate code");
    }

    const nExam = new Exam({
      title,
      code,
      created_by: user._id,
      course: course_id,
      duration,
      type,
      questions: question_ids,
    });
    await nExam.save();
    await nExam.populate("questions");

    res.json(nExam);
  } catch (e) {
    next(e);
  }
};

export default writeExam;
