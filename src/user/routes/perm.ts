import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validate } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_PERM,
  WRITE_PERM,
  UPDATE_PERM,
  DELETE_PERM,
} from "@lxdgc9/pkg/dist/rules/manage";
import readPerm from "../handlers/perm/read";
import readPerms from "../handlers/perm/read-many";
import writePerm from "../handlers/perm/write";
import writePerms from "../handlers/perm/write-many";
import modifyPerm from "../handlers/perm/modify";
import delPerm from "../handlers/perm/delete";
import delPerms from "../handlers/perm/delete-many";

const permRouter = Router();

permRouter
  .route("/")
  .get(guard(READ_PERM), readPerms)
  .post(
    guard(WRITE_PERM),
    validate(
      body("code")
        .notEmpty()
        .withMessage("Required")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("info")
        .notEmpty()
        .withMessage("Required")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("perm_group_id")
        .notEmpty()
        .withMessage("Required")
        .isMongoId()
        .withMessage("Must be string")
    ),
    writePerm
  );

permRouter
  .route("/many")
  .get(guard(READ_PERM), readPerms)
  .post(
    guard(WRITE_PERM),
    validate(
      body()
        .notEmpty()
        .withMessage("Required")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.code")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.info")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("*.perm_group_id").isMongoId().withMessage("Must be mongoId")
    ),
    writePerms
  )
  .delete(
    guard(DELETE_PERM),
    validate(
      body()
        .notEmpty()
        .withMessage("Required")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isMongoId().withMessage("Must be mongoId")
    ),
    delPerms
  );

permRouter
  .route("/:id")
  .get(
    guard(READ_PERM),
    validate(param("id").isMongoId().withMessage("Must be mongoId")),
    readPerm
  )
  .patch(
    guard(UPDATE_PERM),
    validate(
      param("id").isMongoId().withMessage("Must be mongoId"),
      body("code")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("info")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 }),
      body("perm_group_id")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("Must be mongoId")
    ),
    modifyPerm
  )
  .delete(
    guard(DELETE_PERM),
    validate(param("id").isMongoId().withMessage("Must be mongoId")),
    delPerm
  );

export default permRouter;
