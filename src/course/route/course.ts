import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_COURSE,
  INSERT_COURSE,
  SEARCH_COURSE,
  UPDATE_COURSE,
} from "@lxdgc9/pkg/dist/rule/course";
import { Router } from "express";
import { delCourse } from "../handler/course/del";
import { getCourse } from "../handler/course/get";
import { getCourses } from "../handler/course/get-s";
import { newCourse } from "../handler/course/new";

export const r = Router();

r.route("/")
  .get(guard(SEARCH_COURSE), getCourses)
  .post(guard(INSERT_COURSE), validate(), newCourse);
r.route("/:id")
  .get(guard(SEARCH_COURSE), getCourse)
  .patch(guard(UPDATE_COURSE))
  .delete(guard(DELETE_COURSE), delCourse);
