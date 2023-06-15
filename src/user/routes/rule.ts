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
        .withMessage("Must be string"),
      body("info")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string"),
      body("catalog_id")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be MongoId")
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
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Nên chứa ít nhất 1 phần tử"),
      body("*").isObject().withMessage("Nên là Object"),
      body("*.code")
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.info")
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.catalog_id").isMongoId().withMessage("Không đúng định dạng")
    ),
    writeRules
  )
  .delete(
    guard(DELETE_RULE),
    validator(
      body()
        .notEmpty()
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Nên chứa ít nhất 1 phần tử"),
      body("*").isMongoId().withMessage("Không đúng định dạng")
    ),
    deleteRules
  );

r.route("/:id")
  .get(
    guard(READ_RULE),
    validator(param("id").isMongoId().withMessage("Không đúng định dạng")),
    readRule
  )
  .patch(
    guard(UPDATE_RULE),
    validator(
      param("id").isMongoId().withMessage("Không đúng định dạng"),
      body("code")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("info")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 }),
      body("catalog_id")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("Không đúng định dạng")
    ),
    modifyRule
  )
  .delete(
    guard(DELETE_RULE),
    validator(param("id").isMongoId().withMessage("Không đúng định dạng")),
    deleteRule
  );

export default r;
