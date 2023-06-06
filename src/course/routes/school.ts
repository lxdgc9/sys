import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_SCHOOL,
  READ_SCHOOL,
  UPDATE_SCHOOL,
  WRITE_SCHOOL,
} from "@lxdgc9/pkg/dist/rule/course";
import { Router } from "express";
import { body, param } from "express-validator";
import { delItem } from "../handlers/school/delete";
import { delItems } from "../handlers/school/delete-many";
import { readItem } from "../handlers/school/read";
import { readItems } from "../handlers/school/read-many";
import { updateItem } from "../handlers/school/update";
import { allocUser } from "../handlers/school/user/alloc";
import { writeItem } from "../handlers/school/write";
import { writeItems } from "../handlers/school/write-many";
import { uploader } from "../helpers/upload";

export const r = Router();

r.patch("/users", guard(), allocUser);

r.route("/")
  .get(guard(READ_SCHOOL), readItems)
  .post(
    guard(WRITE_SCHOOL),
    uploader("school/logo").single("logo"),
    validate(
      body("code")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("name")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("addr")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("desc")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writeItem
  );

r.route("/many")
  .post(
    guard(WRITE_SCHOOL),
    validate(
      body()
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("*").isObject().withMessage("must be object"),
      body("*.code")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.name")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.addr")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writeItems
  )
  .delete(
    guard(DELETE_SCHOOL),
    validate(
      body("ids")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("ids.*").isMongoId().withMessage("must be mongoId")
    ),
    delItems
  );

r.route("/:id")
  .get(
    guard(READ_SCHOOL),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    readItem
  )
  .patch(
    guard(UPDATE_SCHOOL),
    uploader("unit/logo").single("logo"),
    validate(
      param("id").isMongoId().withMessage("must be mongoId"),
      body("code")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("addr")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("desc")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    updateItem
  )
  .delete(
    guard(DELETE_SCHOOL),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    delItem
  );
