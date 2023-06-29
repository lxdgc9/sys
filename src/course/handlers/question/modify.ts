import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Question } from "../../models/question";

const modifyQuestion: RequestHandler = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    if (!question) {
      throw new NotFoundErr("Question not found");
    }

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default modifyQuestion;
