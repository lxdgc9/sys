import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_ROLE,
  READ_ROLE,
  UPDATE_ROLE,
  WRITE_ROLE,
} from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { delItem } from "../handlers/role/delete";
import { delItems } from "../handlers/role/delete-many";
import { readItem } from "../handlers/role/read";
import { readItems } from "../handlers/role/read-many";
import { updateItem } from "../handlers/role/update";
import { writeItem } from "../handlers/role/write";
import { writeItems } from "../handlers/role/write-many";

export const r = Router();

r.route("/")
  .get(guard(READ_ROLE), readItems)
  .post(
    guard(WRITE_ROLE),
    validate(
      body("name")
        .notEmpty()
        .withMessage("required")
        .withMessage({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("level").isInt({ min: 0 }).withMessage("must be number, >= 0"),
      body("perm_ids")
        .notEmpty()
        .withMessage("required")
        .isArray()
        .withMessage("must be array"),
      body("perm_ids.*").isMongoId().withMessage("must be mongoId")
    ),
    writeItem
  );

r.route("/many")
  .post(
    guard(WRITE_ROLE),
    validate(
      body()
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("*").isObject().withMessage("must be object"),
      body("*.name")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.level")
        .notEmpty()
        .withMessage("required")
        .isInt({ min: 0 })
        .withMessage("must be number, >= 0"),
      body("*.perm_ids").isArray().withMessage("must be array"),
      body("*.perm_ids.*")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId")
    ),
    writeItems
  )
  .delete(
    guard(DELETE_ROLE),
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
    guard(READ_ROLE),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    readItem
  )
  .patch(
    guard(UPDATE_ROLE),
    validate(
      param("id").isMongoId().withMessage("must be mongoId"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("level")
        .optional({ values: "undefined" })
        .isInt({ min: 0 })
        .withMessage("must be number, >= 0"),
      body("perm_ids").optional({ values: "undefined" }).isArray({ min: 1 }),
      body("perm_ids.*").isMongoId().withMessage("must be mongoId")
    ),
    updateItem
  )
  .delete(guard(DELETE_ROLE), validate(param("id").isMongoId()), delItem);
