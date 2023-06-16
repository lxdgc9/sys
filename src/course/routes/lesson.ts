import { Router } from "express";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { READ_USER } from "@lxdgc9/pkg/dist/rules/manage";
import uploader from "../helpers/upload";
import writeLesson from "../handlers/lesson/write";
import deleteLessons from "../handlers/lesson/delete-many";

const r = Router();

r.route("/")
  .post(
    guard(READ_USER),
    uploader("lessons").array("files"),
    validator(),
    writeLesson
  )
  .get(guard(READ_USER), validator());

r.route("/many").delete(guard(), validator(), deleteLessons);

r.route("/:id")
  .get(guard(), validator())
  .delete(guard(), validator(), deleteLessons);

export default r;
