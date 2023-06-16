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

const r = Router();

r.route("/")
  .get(guard(READ_COURSE), readCourses)
  .post(guard(READ_COURSE), validator(), writeCourse);
r.get("/class/:class_id", guard(), validator());
r.route("/:id")
  .get(guard(READ_COURSE), readCourse)
  .patch(guard(UPDATE_COURSE))
  .delete(guard(DELETE_COURSE), delCourse);

export default r;
