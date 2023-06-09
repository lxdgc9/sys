import { guard, validate } from "@lxdgc9/pkg/dist/handlers";
import {
  DELETE_PERM,
  READ_PERM,
  UPDATE_PERM,
  WRITE_PERM,
} from "@lxdgc9/pkg/dist/rules/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { delPermGroup } from "../handlers/perm_group/delete";
import { delPermSets } from "../handlers/perm_group/delete-many";
import { readPermGroup } from "../handlers/perm_group/read";
import { readPermGroup } from "../handlers/perm_group/read-many";
import { modifyPermSet } from "../handlers/perm_group/modify";
import { writePermGroup } from "../handlers/perm_group/write";
import { writePermSets } from "../handlers/perm_group/write-many";

export const r = Router();

r.route("/")
  .get(guard(READ_PERM), readPermGroup)
  .post(
    guard(WRITE_PERM),
    validate(
      body("name")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writePermGroup
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
      body("*.name")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writePermSets
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
    delPermSets
  );

r.route("/:id")
  .get(
    guard(READ_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    readPermGroup
  )
  .patch(
    guard(UPDATE_PERM),
    validate(
      param("id").isMongoId().withMessage("must be mongoId"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("perm_ids")
        .optional({ values: "undefined" })
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("perm_ids.*").isMongoId().withMessage("must be mongoId")
    ),
    modifyPermSet
  )
  .delete(
    guard(DELETE_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    delPermGroup
  );
