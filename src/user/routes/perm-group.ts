import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validate } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_PERM,
  WRITE_PERM,
  UPDATE_PERM,
  DELETE_PERM,
} from "@lxdgc9/pkg/dist/rules/manage";
import readPermGroup from "../handlers/perm_group/read";
import readPermGroups from "../handlers/perm_group/read-many";
import writePermGroup from "../handlers/perm_group/write";
import writePermGroups from "../handlers/perm_group/write-many";
import modifyPermGroup from "../handlers/perm_group/modify";
import delPermGroup from "../handlers/perm_group/delete";
import delPermGroups from "../handlers/perm_group/delete-many";

const permGroupRouter = Router();

permGroupRouter
  .route("/")
  .get(guard(READ_PERM), readPermGroups)
  .post(
    guard(WRITE_PERM),
    validate(
      body("name")
        .notEmpty()
        .withMessage("Required")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writePermGroup
  );

permGroupRouter
  .route("/many")
  .get(guard(READ_PERM), readPermGroups)
  .post(
    guard(WRITE_PERM),
    validate(
      body()
        .notEmpty()
        .withMessage("Required")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.name")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    writePermGroups
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
    delPermGroups
  );

permGroupRouter
  .route("/:id")
  .get(
    guard(READ_PERM),
    validate(param("id").isMongoId().withMessage("Must be mongoId")),
    readPermGroup
  )
  .patch(
    guard(UPDATE_PERM),
    validate(
      param("id").isMongoId().withMessage("Must be mongoId"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    modifyPermGroup
  )
  .delete(
    guard(DELETE_PERM),
    validate(param("id").isMongoId().withMessage("Must be mongoId")),
    delPermGroup
  );

export default permGroupRouter;
