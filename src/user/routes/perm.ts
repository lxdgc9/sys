import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_PERM,
  READ_PERM,
  UPDATE_PERM,
  WRITE_PERM,
} from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { delItem } from "../handlers/perm/delete";
import { delItems } from "../handlers/perm/delete-many";
import { readItem } from "../handlers/perm/read";
import { readItems } from "../handlers/perm/read-many";
import { updateItem } from "../handlers/perm/update";
import { writeItem } from "../handlers/perm/write";
import { writeItems } from "../handlers/perm/write-many";

export const r = Router();

r.route("/")
  .get(guard(READ_PERM), readItems)
  .post(
    guard(WRITE_PERM),
    validate(
      body("code")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("desc")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("grp_id")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId")
    ),
    writeItem
  );

r.route("/many")
  .post(
    guard(WRITE_PERM),
    validate(
      body()
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("*").isObject().withMessage("must be object"),
      body("*.code")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.desc")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.grp_id").isMongoId().withMessage("must be mongoId")
    ),
    writeItems
  )
  .delete(
    guard(DELETE_PERM),
    validate(
      body()
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("*").isMongoId().withMessage("must be mongoId")
    ),
    delItems
  );

r.route("/:id")
  .get(
    guard(READ_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    readItem
  )
  .patch(
    guard(UPDATE_PERM),
    validate(
      param("id").isMongoId().withMessage("must be mongoId"),
      body("code")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("desc")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 }),
      body("grp_id")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("must be mongoId")
    ),
    updateItem
  )
  .delete(
    guard(DELETE_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    delItem
  );
