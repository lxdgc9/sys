import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { READ_USER } from "@lxdgc9/pkg/dist/rules/manage";
import { Router } from "express";
import { deleteLesson } from "../handlers/lesson/delete";
import { delManyLesson } from "../handlers/lesson/delete-many";
import { createLesson } from "../handlers/lesson/write";
import { uploader } from "../helpers/upload";

export const r = Router();

r.route("/")
  .post(
    guard(READ_USER),
    uploader("lessons").array("files"),
    validator(),
    createLesson
  )
  .get(guard(READ_USER), validator());

r.route("/many").delete(guard(), validator(), delManyLesson);

r.route("/:id")
  .get(guard(), validator())
  .delete(guard(), validator(), deleteLesson);
