import { Router } from "express";
import { body, param, query } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_CLASS,
  WRITE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
} from "@lxdgc9/pkg/dist/rules/course";
import readUser from "../handlers/user/read";
import readClasses from "../handlers/class/read-many";
import delClass from "../handlers/class/delete";
import delClasses from "../handlers/class/delete-many";
import modifyClass from "../handlers/class/modify";
import writeClasses from "../handlers/class/write-many";
import writeClass from "../handlers/class/write";
import readClass from "../handlers/class/read";

const classRouter = Router();

classRouter
  .route("/")
  .get(
    guard(READ_CLASS),
    validator(
      query("school_id")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("Must be MongoId")
    ),
    readClasses
  )
  .post(
    guard(WRITE_CLASS),
    validator(
      body("name")
        .notEmpty()
        .withMessage("Required")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("school_id")
        .notEmpty()
        .withMessage("Required")
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

classRouter
  .route("/many")
  .post(
    guard(WRITE_CLASS),
    validator(
      body()
        .notEmpty()
        .withMessage("Required")
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
        .withMessage("Required")
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

classRouter
  .route("/:id")
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

export default classRouter;
