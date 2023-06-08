import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_COURSE,
  READ_COURSE,
  UPDATE_COURSE,
} from "@lxdgc9/pkg/dist/rule/course";
import { READ_USER } from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { delCourse } from "../handlers/course/delete";
import { getCourse } from "../handlers/course/read";
import { getCourses } from "../handlers/course/read-many";
import { createCourse } from "../handlers/course/write";

export const r = Router();

r.route("/")
  .get(guard(READ_COURSE), getCourses)
  .post(guard(READ_USER), validate(), createCourse);
r.route("/:id")
  .get(guard(READ_COURSE), getCourse)
  .patch(guard(UPDATE_COURSE))
  .delete(guard(DELETE_COURSE), delCourse);
