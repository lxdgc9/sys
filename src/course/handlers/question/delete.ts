import { RequestHandler } from "express";
import { BadReqErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { Question } from "../../models/question";
import { User } from "../../models/user";

const deleteQuestion: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id });
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      throw new BadReqErr("Question not found");
    }

    if (!question.created_by.equals(user._id)) {
      throw new BadReqErr("Invalid question");
    }

    await question.deleteOne();

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default deleteQuestion;
