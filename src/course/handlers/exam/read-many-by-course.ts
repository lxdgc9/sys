import { RequestHandler } from "express";
import { Exam } from "../../models/examination";

const readExamsByCourse: RequestHandler = async (req, res, next) => {
  try {
    const exams = await Exam.find({ course: req.params.course_id }).populate([
      { path: "questions" },
      {
        path: "created_by",
        select: "-schools -classes -created_courses -courses",
      },
    ]);

    res.json(exams);
  } catch (e) {
    next(e);
  }
};

export default readExamsByCourse;
