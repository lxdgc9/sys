import { RequestHandler } from "express";
import { Exam } from "../../models/examination";
import { User } from "../../models/user";
import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";

const redaMyCreatedExams: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id });
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    const exams = await Exam.find({ created_by: user._id }).populate(
      "questions"
    );
    res.json(exams);
  } catch (e) {
    next(e);
  }
};

export default redaMyCreatedExams;
