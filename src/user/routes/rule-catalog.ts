import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_RULE,
  WRITE_RULE,
  UPDATE_RULE,
  DELETE_RULE,
} from "@lxdgc9/pkg/dist/rules/manage";
import readCatalog from "../handlers/rule_catalog/read";
import readCatalogs from "../handlers/rule_catalog/read-many";
import writeCatalog from "../handlers/rule_catalog/write";
import writeCatalogs from "../handlers/rule_catalog/write-many";
import modifyCatalog from "../handlers/rule_catalog/modify";
import deleteCatalog from "../handlers/rule_catalog/delete";
import deleteCatalogs from "../handlers/rule_catalog/delete-many";

const r = Router();

r.route("/")
  .get(guard(READ_RULE), readCatalogs)
  .post(
    guard(WRITE_RULE),
    validator(
      body("name")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
    ),
    writeCatalog
  );

r.route("/many")
  .post(
    guard(WRITE_RULE),
    validator(
      body()
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.name").isString().withMessage("Must be string")
    ),
    writeCatalogs
  )
  .delete(
    guard(DELETE_RULE),
    validator(
      body()
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isMongoId().withMessage("Must be mongoId")
    ),
    deleteCatalogs
  );

r.route("/:id")
  .get(
    guard(READ_RULE),
    validator(param("id").isMongoId().withMessage("Must be mongoId")),
    readCatalog
  )
  .patch(
    guard(UPDATE_RULE),
    validator(
      param("id").isMongoId().withMessage("Must be mongoId"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
    ),
    modifyCatalog
  )
  .delete(
    guard(DELETE_RULE),
    validator(param("id").isMongoId().withMessage("Must be mongoId")),
    deleteCatalog
  );

export default r;
