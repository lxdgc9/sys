import { Router } from "express";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  DELETE_COURSE,
  READ_COURSE,
  UPDATE_COURSE,
} from "@lxdgc9/pkg/dist/rules/course";
import readCourses from "../handlers/course/read-many";
import writeCourse from "../handlers/course/write";
import delCourse from "../handlers/course/delete";
import readCourse from "../handlers/course/read";
import readMyCoursesByClass from "../handlers/course/my-course-by-class";
import { param } from "express-validator";
import readMyCreatedCourses from "../handlers/course/my-created-course";

const r = Router();

r.route("/")
  .get(guard(READ_COURSE), readCourses)
  .post(guard(READ_COURSE), validator(), writeCourse);
r.get("/my-created-courses", guard(READ_COURSE), readMyCreatedCourses);
r.get(
  "/class/:class_id",
  guard(READ_COURSE),
  validator(param("class_id").isMongoId().withMessage("Must be mongoId")),
  readMyCoursesByClass
);
r.route("/:id")
  .get(guard(READ_COURSE), readCourse)
  .patch(guard(UPDATE_COURSE))
  .delete(guard(DELETE_COURSE), delCourse);

export default r;
