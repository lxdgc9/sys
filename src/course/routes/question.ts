import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { Router } from "express";
import readQuestionsByCourse from "../handlers/question/read-many-by-course";
import { body } from "express-validator";
import writeQuestion from "../handlers/question/write";
import deleteQuestion from "../handlers/question/delete";

const r = Router();

r.get("/by-course/:course_id", guard(), validator(), readQuestionsByCourse);
r.post(
  "/",
  guard(),
  validator(
    body("content")
      .notEmpty()
      .withMessage("Not empty")
      .isString()
      .withMessage("Must be string"),
    body("course_id")
      .notEmpty()
      .withMessage("Not empty")
      .isMongoId()
      .withMessage("Must be mongoId"),
    body("type")
      .notEmpty()
      .withMessage("Must be string")
      .isIn(["choice", "essay"])
      .withMessage("Invalid type"),
    body("difficult")
      .notEmpty()
      .withMessage("Not empty")
      .isInt({ min: 0, max: 5 })
      .withMessage("Must be integer in range 0, 5"),
    body("has_many_ans")
      .notEmpty()
      .withMessage("Not empty")
      .isBoolean()
      .withMessage("Must be boolean")
  ),
  writeQuestion
);
r.delete("/:id", guard(), validator(), deleteQuestion);

export default r;
