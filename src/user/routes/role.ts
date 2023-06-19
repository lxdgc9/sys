import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_ROLE,
  WRITE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
} from "@lxdgc9/pkg/dist/rules/manage";
import readRole from "../handlers/role/read";
import readRoles from "../handlers/role/read-many";
import writeRole from "../handlers/role/write";
import writeRoles from "../handlers/role/write-many";
import modifyRole from "../handlers/role/modify";
import deleteRole from "../handlers/role/delete";
import deleteRoles from "../handlers/role/delete-many";

const r = Router();

r.route("/")
  .get(guard(READ_ROLE), readRoles)
  .post(
    guard(WRITE_ROLE),
    validator(
      body("name").notEmpty().withMessage("Not empty").trim().escape(),
      body("level").isInt({ min: 0 }).withMessage("Must be Int > 0"),
      body("rule_ids")
        .notEmpty()
        .withMessage("Not empty")
        .isArray()
        .withMessage("Must be array")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("rule_ids.*").isMongoId().withMessage("Must be mongoId")
    ),
    writeRole
  );

r.route("/many")
  .get(guard(READ_ROLE), readRoles)
  .post(
    guard(WRITE_ROLE),
    validator(
      body()
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.name")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .trim()
        .escape(),
      body("*.level")
        .notEmpty()
        .withMessage("Not empty")
        .isInt({ min: 0 })
        .withMessage("Must be Int > 0"),
      body("*.rule_ids")
        .isArray()
        .withMessage("Must be array")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("*.rule_ids.*")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be mongoId")
    ),
    writeRoles
  )
  .delete(
    guard(DELETE_ROLE),
    validator(
      body()
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("*").isMongoId().withMessage("Must be object")
    ),
    deleteRoles
  );

r.route("/:id")
  .get(
    guard(READ_ROLE),
    validator(param("id").isMongoId().withMessage("Must be object")),
    readRole
  )
  .patch(
    guard(UPDATE_ROLE),
    validator(
      param("id").isMongoId().withMessage("Must be object"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .trim()
        .escape(),
      body("level")
        .optional({ values: "undefined" })
        .isInt({ min: 0 })
        .withMessage("Must be Int > 0"),
      body("rule_ids")
        .optional({ values: "undefined" })
        .isArray()
        .withMessage("Must be array")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("rule_ids.*").isMongoId().withMessage("Must be mongoId")
    ),
    modifyRole
  )
  .delete(
    guard(DELETE_ROLE),
    validator(param("id").isMongoId().withMessage("Must be mongoId")),
    deleteRole
  );

export default r;
