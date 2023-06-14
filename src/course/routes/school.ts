import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_SCHOOL,
  WRITE_SCHOOL,
  UPDATE_SCHOOL,
  DELETE_SCHOOL,
} from "@lxdgc9/pkg/dist/rules/course";
import uploader from "../helpers/upload";
import readSchool from "../handlers/school/read";
import readSchools from "../handlers/school/read-many";
import writeSchool from "../handlers/school/write";
import writeSchools from "../handlers/school/write-many";
import modifySchool from "../handlers/school/modify";
import delSchools from "../handlers/school/delete-many";
import delSchool from "../handlers/school/delete";

const schoolRouter = Router();

schoolRouter
  .route("/")
  .get(guard(READ_SCHOOL), readSchools)
  .post(
    guard(WRITE_SCHOOL),
    uploader("school/logo").single("logo"),
    validator(
      body("code")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("name")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("address")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("description")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writeSchool
  );

schoolRouter
  .route("/many")
  .post(
    guard(WRITE_SCHOOL),
    validator(
      body().isArray({ min: 1 }).withMessage("Should be at least 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.code")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.name")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.address")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.description")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writeSchools
  )
  .delete(
    guard(DELETE_SCHOOL),
    validator(
      body().isArray({ min: 1 }).withMessage("Should be at least 1 element"),
      body("*").isMongoId().withMessage("Must be MongoId")
    ),
    delSchools
  );

schoolRouter
  .route("/:id")
  .get(
    guard(READ_SCHOOL),
    validator(param("id").isMongoId().withMessage("Must be MongoId")),
    readSchool
  )
  .patch(
    guard(UPDATE_SCHOOL),
    uploader("unit/logo").single("logo"),
    validator(
      param("id").isMongoId().withMessage("Must be MongoId"),
      body("code")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("addr")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("desc")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    modifySchool
  )
  .delete(
    guard(DELETE_SCHOOL),
    validator(param("id").isMongoId().withMessage("Must be MongoId")),
    delSchool
  );

export default schoolRouter;
