import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validate } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_ROLE,
  WRITE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
} from "@lxdgc9/pkg/dist/rules/manage";
import readRole from "../handlers/role/read";
import readRoles from "../handlers/role/read-many";
import writeRole from "../handlers/role/write";
import writePerms from "../handlers/perm/write-many";
import modifyRole from "../handlers/role/modify";
import delRole from "../handlers/role/delete";
import delRoles from "../handlers/role/delete-many";

export const roleRouter = Router();

roleRouter
  .route("/")
  .get(guard(READ_ROLE), readRoles)
  .post(
    guard(WRITE_ROLE),
    validate(
      body("name")
        .notEmpty()
        .withMessage("Required")
        .withMessage({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("level").isInt({ min: 0 }).withMessage("Must be number, >= 0"),
      body("perm_ids")
        .notEmpty()
        .withMessage("Required")
        .isArray()
        .withMessage("Must be array"),
      body("perm_ids.*").isMongoId().withMessage("Must be mongoId")
    ),
    writeRole
  );

roleRouter
  .route("/many")
  .get(guard(READ_ROLE), readRoles)
  .post(
    guard(WRITE_ROLE),
    validate(
      body()
        .notEmpty()
        .withMessage("Required")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.name")
        .notEmpty()
        .withMessage("Required")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.level")
        .notEmpty()
        .withMessage("Required")
        .isInt({ min: 0 })
        .withMessage("Must be number, >= 0"),
      body("*.perm_ids").isArray().withMessage("Must be array"),
      body("*.perm_ids.*")
        .notEmpty()
        .withMessage("Required")
        .isMongoId()
        .withMessage("Must be mongoId")
    ),
    writePerms
  )
  .delete(
    guard(DELETE_ROLE),
    validate(
      body()
        .notEmpty()
        .withMessage("Required")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isMongoId().withMessage("Must be mongoId")
    ),
    delRoles
  );

roleRouter
  .route("/:id")
  .get(
    guard(READ_ROLE),
    validate(param("id").isMongoId().withMessage("Must be mongoId")),
    readRole
  )
  .patch(
    guard(UPDATE_ROLE),
    validate(
      param("id").isMongoId().withMessage("Must be mongoId"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("level")
        .optional({ values: "undefined" })
        .isInt({ min: 0 })
        .withMessage("Must be number, >= 0"),
      body("perm_ids").optional({ values: "undefined" }).isArray({ min: 1 }),
      body("perm_ids.*").isMongoId().withMessage("Must be mongoId")
    ),
    modifyRole
  )
  .delete(
    guard(DELETE_ROLE),
    validate(param("id").isMongoId().withMessage("Must be mongoId")),
    delRole
  );

export default roleRouter;
