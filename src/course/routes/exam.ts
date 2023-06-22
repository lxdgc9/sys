import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { Router } from "express";
import { body, param } from "express-validator";
import redaMyCreatedExams from "../handlers/exam/read-my-created-exams";
import readExamsByCourse from "../handlers/exam/read-many-by-course";
import writeExam from "../handlers/exam/write";

const r = Router();

r.get("/my-created-courses", guard(), redaMyCreatedExams);
r.get("/by-course/:course_id", guard(), validator(), readExamsByCourse);

r.post(
  "/",
  guard(),
  validator(
    body("title")
      .notEmpty()
      .withMessage("Not empty")
      .isString()
      .withMessage("Must be string"),
    body("code")
      .notEmpty()
      .withMessage("Not empty")
      .isString()
      .withMessage("Must be string"),
    body("course_id")
      .notEmpty()
      .withMessage("Not empty")
      .isMongoId()
      .withMessage("Must be mongoId"),
    body("duration")
      .notEmpty()
      .withMessage("Not empty")
      .isInt({ min: 0 })
      .withMessage("Must be integer with min: 0"),
    body("type")
      .notEmpty()
      .withMessage("Not empty")
      .isString()
      .withMessage("Must be string"),
    body("question_ids")
      .notEmpty()
      .withMessage("Not empty")
      .isArray()
      .withMessage("Must be array"),
    body("question_ids.*").isMongoId().withMessage("Must be mongoId")
  ),
  writeExam
);

export default r;
