import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_COURSE,
  READ_COURSE,
  UPDATE_COURSE,
  WRITE_COURSE,
} from "@lxdgc9/pkg/dist/rule/course";
import { Router } from "express";
import { delCourse } from "../handler/course/del";
import { getCourse } from "../handler/course/get";
import { getCourses } from "../handler/course/get-s";
import { newCourse } from "../handler/course/new";

export const r = Router();

r.route("/")
  .get(guard(READ_COURSE), getCourses)
  .post(guard(WRITE_COURSE), validate(), newCourse);
r.route("/:id")
  .get(guard(READ_COURSE), getCourse)
  .patch(guard(UPDATE_COURSE))
  .delete(guard(DELETE_COURSE), delCourse);
