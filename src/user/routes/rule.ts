import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_RULE,
  WRITE_RULE,
  UPDATE_RULE,
  DELETE_RULE,
} from "@lxdgc9/pkg/dist/rules/manage";
import readRule from "../handlers/rule/read";
import readRules from "../handlers/rule/read-many";
import writeRule from "../handlers/rule/write";
import writeRules from "../handlers/rule/write-many";
import modifyRule from "../handlers/rule/modify";
import deleteRule from "../handlers/rule/delete";
import deleteRules from "../handlers/rule/delete-many";

const r = Router();

r.route("/")
  .get(guard(READ_RULE), readRules)
  .post(
    guard(WRITE_RULE),
    validator(
      body("code")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .trim()
        .toUpperCase()
        .escape(),
      body("info")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .trim()
        .escape(),
      body("catalog_id")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be mongoId")
    ),
    writeRule
  );

r.route("/many")
  .get(guard(READ_RULE), readRules)
  .post(
    guard(WRITE_RULE),
    validator(
      body()
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.code")
        .isString()
        .withMessage("Must be string")
        .trim()
        .toUpperCase()
        .escape(),
      body("*.info").isString().withMessage("Must be string").trim().escape(),
      body("*.catalog_id").isMongoId().withMessage("Must be mongoId")
    ),
    writeRules
  )
  .delete(
    guard(DELETE_RULE),
    validator(
      body()
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("*").isMongoId().withMessage("Must be mongoId")
    ),
    deleteRules
  );

r.route("/:id")
  .get(
    guard(READ_RULE),
    validator(param("id").isMongoId().withMessage("Must be mongoId")),
    readRule
  )
  .patch(
    guard(UPDATE_RULE),
    validator(
      param("id").isMongoId().withMessage("Must be mongoId"),
      body("code")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .trim()
        .toUpperCase()
        .escape(),
      body("info")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .trim()
        .escape(),
      body("catalog_id")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("Must be mongoId")
    ),
    modifyRule
  )
  .delete(
    guard(DELETE_RULE),
    validator(param("id").isMongoId().withMessage("Must be mongoId")),
    deleteRule
  );

export default r;
