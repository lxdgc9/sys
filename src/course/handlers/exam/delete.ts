import { RequestHandler } from "express";
import { User } from "../../models/user";
import { BadReqErr, NotFoundErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { Exam } from "../../models/examination";

const deleteExam: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id });
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      throw new NotFoundErr("Exam not found");
    }

    if (!exam.created_by.equals(user._id)) {
      throw new BadReqErr("Invalid exam");
    }

    await exam.deleteOne();

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default deleteExam;
