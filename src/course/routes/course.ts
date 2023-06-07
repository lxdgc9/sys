import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_COURSE,
  READ_COURSE,
  UPDATE_COURSE,
} from "@lxdgc9/pkg/dist/rule/course";
import { READ_USER } from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { delItem } from "../handlers/course/delete";
import { getCourse } from "../handlers/course/get";
import { readCourses } from "../handlers/course/read-many";
import { writeItem } from "../handlers/course/write";

export const r = Router();

r.route("/")
  .get(guard(READ_COURSE), readCourses)
  .post(guard(READ_USER), validate(), writeItem);
r.route("/:id")
  .get(guard(READ_COURSE), getCourse)
  .patch(guard(UPDATE_COURSE))
  .delete(guard(DELETE_COURSE), delItem);
