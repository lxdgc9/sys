import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_CLASS,
  WRITE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
} from "@lxdgc9/pkg/dist/rules/course";
import readClasses from "../handlers/class/read-many";
import delClass from "../handlers/class/delete";
import delClasses from "../handlers/class/delete-many";
import modifyClass from "../handlers/class/modify";
import writeClasses from "../handlers/class/write-many";
import writeClass from "../handlers/class/write";
import readClass from "../handlers/class/read";

const r = Router();

r.route("/")
  .get(guard(READ_CLASS), validator(), readClasses)
  .post(
    guard(WRITE_CLASS),
    validator(
      body("name")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string"),
      body("school_id")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be MongoId")
    ),
    writeClass
  )
  .patch(guard(UPDATE_CLASS), modifyClass)
  .delete(
    guard(DELETE_CLASS),
    validator(param("id").isMongoId().withMessage("Must be MongoId")),
    delClass
  );

r.route("/many")
  .post(
    guard(WRITE_CLASS),
    validator(
      body()
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.name")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.school_id")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be MongoId")
    ),
    writeClasses
  )
  .delete(
    guard(DELETE_CLASS),
    validator(
      body().isArray({ min: 1 }).withMessage("Should be at least 1 element"),
      body("*").isMongoId().withMessage("Must be MongoId")
    ),
    delClasses
  );

r.route("/:id")
  .get(
    guard(READ_CLASS),
    validator(param("id").isMongoId().withMessage("Must be MongoId")),
    readClass
  )
  .patch()
  .delete(
    guard(DELETE_CLASS),
    validator(param("id").isMongoId().withMessage("Must be MongoId")),
    delClass
  );

export default r;
