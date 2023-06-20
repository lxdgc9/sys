import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_CLASS,
  WRITE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
} from "@lxdgc9/pkg/dist/rules/course";
import readClass from "../handlers/class/read";
import readClasses from "../handlers/class/read-many";
import readClassesBySchool from "../handlers/class/read-many-by-school";
import writeClass from "../handlers/class/write";
import writeClasses from "../handlers/class/write-many";
import modifyClass from "../handlers/class/modify";
import deleteClass from "../handlers/class/delete";
import deleteClasses from "../handlers/class/delete-many";

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
    deleteClass
  );

r.get(
  "/by-school/:school_id",
  guard(READ_CLASS),
  validator(param("school_id").isMongoId().withMessage("Must be mongoId")),
  readClassesBySchool
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
      body()
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("*").isMongoId().withMessage("Must be MongoId")
    ),
    deleteClasses
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
    deleteClass
  );

export default r;
