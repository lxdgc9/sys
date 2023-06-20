import { Router } from "express";
import { body } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  DELETE_COURSE,
  READ_COURSE,
  WRITE_COURSE,
} from "@lxdgc9/pkg/dist/rules/course";
import uploader from "../helpers/upload";
import writeLesson from "../handlers/lesson/write";
import deleteLessons from "../handlers/lesson/delete-many";

const r = Router();

r.route("/")
  .post(
    guard(WRITE_COURSE),
    uploader("lessons").array("files"),
    validator(
      body("course_id")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be mongoId"),
      body("title")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string"),
      body("content")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
    ),
    writeLesson
  )
  .get(guard(READ_COURSE), validator());

r.route("/many").delete(guard(DELETE_COURSE), validator(), deleteLessons);

r.route("/:id")
  .get(guard(READ_COURSE), validator())
  .delete(guard(DELETE_COURSE), validator(), deleteLessons);

export default r;
