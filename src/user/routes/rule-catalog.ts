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
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Nên chứa ít nhất một phần tử"),
      body("*").isObject().withMessage("Must be object"),
      body("*.name")
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writeCatalogs
  )
  .delete(
    guard(DELETE_RULE),
    validator(
      body()
        .notEmpty()
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Nên chứa ít nhất một phần tử"),
      body("*").isMongoId().withMessage("Không đúng định dạng")
    ),
    deleteCatalogs
  );

r.route("/:id")
  .get(
    guard(READ_RULE),
    validator(param("id").isMongoId().withMessage("Không đúng định dạng")),
    readCatalog
  )
  .patch(
    guard(UPDATE_RULE),
    validator(
      param("id").isMongoId().withMessage("Không đúng định dạng"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    modifyCatalog
  )
  .delete(
    guard(DELETE_RULE),
    validator(param("id").isMongoId().withMessage("Không đúng định dạng")),
    deleteCatalog
  );

export default r;
