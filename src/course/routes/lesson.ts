import { Router } from "express";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { READ_USER } from "@lxdgc9/pkg/dist/rules/manage";
import uploader from "../helpers/upload";
import writeLesson from "../handlers/lesson/write";
import delLessons from "../handlers/lesson/delete-many";

const lessonRouter = Router();

lessonRouter
  .route("/")
  .post(
    guard(READ_USER),
    uploader("lessons").array("files"),
    validator(),
    writeLesson
  )
  .get(guard(READ_USER), validator());

lessonRouter.route("/many").delete(guard(), validator(), delLessons);

lessonRouter
  .route("/:id")
  .get(guard(), validator())
  .delete(guard(), validator(), delLessons);

export default lessonRouter;
