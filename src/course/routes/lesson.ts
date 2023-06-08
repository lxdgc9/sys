import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import { READ_USER } from "@lxdgc9/pkg/dist/rule/manage";
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
    validate(),
    createLesson
  )
  .get(guard(READ_USER), validate());

r.route("/many").delete(guard(), validate(), delManyLesson);

r.route("/:id")
  .get(guard(), validate())
  .delete(guard(), validate(), deleteLesson);
