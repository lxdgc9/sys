import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_PERM,
  READ_PERM,
  UPDATE_PERM,
  WRITE_PERM,
} from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { delPermGrp } from "../handlers/perm_grp/delete";
import { delManyPermGrp } from "../handlers/perm_grp/delete-many";
import { readGroup } from "../handlers/perm_grp/read";
import { getManyPermGrp } from "../handlers/perm_grp/read-many";
import { updatePermGrp } from "../handlers/perm_grp/update";
import { writePermSet } from "../handlers/perm_grp/write";
import { writePermSets } from "../handlers/perm_grp/write-many";

export const r = Router();

r.route("/")
  .get(guard(READ_PERM), getManyPermGrp)
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
    writePermSet
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
    delManyPermGrp
  );

r.route("/:id")
  .get(
    guard(READ_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    readGroup
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
    updatePermGrp
  )
  .delete(
    guard(DELETE_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    delPermGrp
  );
