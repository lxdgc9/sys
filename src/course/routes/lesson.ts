import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import { READ_USER } from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { writeItem as createLesson } from "../handlers/lesson/write";
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

r.route("/:id")
  .get(guard(READ_USER), validate())
  .post(guard(READ_USER), validate());
