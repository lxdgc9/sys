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
import modifyRole from "../handlers/role/modify";
import deleteRole from "../handlers/role/delete";
import deleteRoles from "../handlers/role/delete-many";
import writeRoles from "../handlers/role/write-many";

const r = Router();

r.route("/")
  .get(guard(READ_ROLE), readRoles)
  .post(
    guard(WRITE_ROLE),
    validator(
      body("name")
        .notEmpty()
        .withMessage("Bắt buộc")
        .withMessage({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("level").isInt({ min: 0 }).withMessage("Phải là số nguyên dương"),
      body("rule_ids")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isArray()
        .withMessage("Phải là mảng")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("rule_ids.*").isMongoId().withMessage("Không đúng định dạng")
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
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Nên chứa ít nhất 1 phần tử"),
      body("*").isObject().withMessage("Nên là Object"),
      body("*.name")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isString()
        .withMessage("Nên là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.level")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isInt({ min: 0 })
        .withMessage("Nên là một số lớn hơn 0"),
      body("*.rule_ids").isArray().withMessage("Nên là mảng"),
      body("*.rule_ids.*")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isMongoId()
        .withMessage("Không đúng định dạng")
    ),
    writeRoles
  )
  .delete(
    guard(DELETE_ROLE),
    validator(
      body()
        .notEmpty()
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Nên chứa ít nhất 1 phần tử"),
      body("*").isMongoId().withMessage("Không đúng định dạng")
    ),
    deleteRoles
  );

r.route("/:id")
  .get(
    guard(READ_ROLE),
    validator(param("id").isMongoId().withMessage("Không đúng định dạng")),
    readRole
  )
  .patch(
    guard(UPDATE_ROLE),
    validator(
      param("id").isMongoId().withMessage("Không đúng định dạng"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Nên là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("level")
        .optional({ values: "undefined" })
        .isInt({ min: 0 })
        .withMessage("Nên là một số lớn hơn 0"),
      body("rule_ids").optional({ values: "undefined" }).isArray({ min: 1 }),
      body("rule_ids.*").isMongoId().withMessage("Không đúng định dạng")
    ),
    modifyRole
  )
  .delete(
    guard(DELETE_ROLE),
    validator(param("id").isMongoId().withMessage("Không đúng định dạng")),
    deleteRole
  );

export default r;
