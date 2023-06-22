import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Exam } from "../../models/examination";

const deleteExam: RequestHandler = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      throw new NotFoundErr("Exam not found");
    }

    console.log("hello world");

    // await exam.deleteOne();

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default deleteExam;
