import { RequestHandler } from "express";
import { Question } from "../../models/question";

const readQuestionsByCourse: RequestHandler = async (req, res, next) => {
  try {
    const questions = await Question.find({
      course: req.params.course_id,
    }).populate([
      {
        path: "created_by",
        select: "-classes -created_courses -courses -schools",
      },
    ]);

    res.json(questions);
  } catch (e) {
    next(e);
  }
};

export default readQuestionsByCourse;
