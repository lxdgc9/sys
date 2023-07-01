import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  DELETE_COURSE,
  READ_COURSE,
  UPDATE_COURSE,
  WRITE_COURSE,
} from "@lxdgc9/pkg/dist/rules/course";
import readCourses from "../handlers/course/read-many";
import writeCourse from "../handlers/course/write";
import deleteCourse from "../handlers/course/delete";
import readCourse from "../handlers/course/read";
import readCoursesByClass from "../handlers/course/my-course-by-class";
import readMyCreatedCourses from "../handlers/course/my-created-course";
import readMyCourses from "../handlers/course/read-my-courses";
import updateProcess from "../handlers/course/update-process";
import changeStatusCourse from "../handlers/course/change-status-course";
import modifyCourse from "../handlers/course/update";
import { ACCESS_COURSE } from "@lxdgc9/pkg/dist/rules/app";

const r = Router();

r.route("/")
  .get(guard(READ_COURSE), readCourses)
  .post(
    guard(WRITE_COURSE),
    validator(
      body("title")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .trim()
        .escape(),
      body("content")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .trim()
        .escape(),
      body("is_publish")
        .optional({ values: "undefined" })
        .isBoolean()
        .withMessage("Must be boolean")
        .escape(),
      body("class_ids")
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("class_ids.*").isMongoId().withMessage("Must be mongoId")
    ),
    writeCourse
  );

r.get("/my-courses", guard(ACCESS_COURSE), readMyCourses);

r.get("/my-courses-by-class/:class_id", guard(READ_COURSE), readCoursesByClass);

r.get("/my-created-courses", guard(READ_COURSE), readMyCreatedCourses);

r.get(
  "/class/:class_id",
  guard(READ_COURSE),
  validator(param("class_id").isMongoId().withMessage("Must be mongoId")),
  readCoursesByClass
);

r.route("/:id")
  .get(guard(READ_COURSE), readCourse)
  .patch(
    guard(UPDATE_COURSE),
    validator(
      body("title")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string"),
      body("content")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string"),
      body("is_publish")
        .optional({ values: "undefined" })
        .isBoolean()
        .withMessage("Must be boolean"),
      body("class_ids")
        .optional({ values: "undefined" })
        .isArray()
        .withMessage("Must be array"),
      body("class_ids.*").isMongoId().withMessage("Must be mongoId")
    ),
    modifyCourse
  )
  .delete(guard(DELETE_COURSE), deleteCourse);

r.patch(
  "/process/:course_id",
  guard(UPDATE_COURSE),
  validator(
    param("course_id").isMongoId().withMessage("Must be mongoId"),
    body("process")
      .notEmpty()
      .withMessage("Not empty")
      .isInt({ min: 0, max: 100 })
      .withMessage("Must be number in range 0, 100")
  ),
  updateProcess
);

r.patch(
  "/publish/:course_id",
  guard(UPDATE_COURSE),
  validator(
    param("course_id").isMongoId().withMessage("Must be mongoId"),
    body("status")
      .notEmpty()
      .withMessage("Not empty")
      .isBoolean()
      .withMessage("Must be boolean")
  ),
  changeStatusCourse
);

export default r;
