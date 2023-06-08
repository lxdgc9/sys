import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_CLASS,
  READ_CLASS,
  UPDATE_CLASS,
  WRITE_CLASS,
} from "@lxdgc9/pkg/dist/rule/course";
import { Router } from "express";
import { body, param } from "express-validator";
import { delItem } from "../handlers/class/delete";
import { delItems } from "../handlers/class/delete-many";
import { getClasses } from "../handlers/class/read-many";
import { updateItem } from "../handlers/class/update";
import { createClass } from "../handlers/class/write";
import { writeItems } from "../handlers/class/write-many";
import { getUser } from "../handlers/user/read";

export const r = Router();

r.route("/")
  .get(guard(READ_CLASS), getClasses)
  .post(
    guard(WRITE_CLASS),
    validate(
      body("name")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("school_id")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId"),
      body("member_ids").isArray().withMessage("must be array"),
      body("member_ids.*").isMongoId().withMessage("must be mongoId")
    ),
    createClass
  )
  .patch(guard(UPDATE_CLASS), updateItem)
  .delete(
    guard(DELETE_CLASS),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    delItem
  );

r.route("/many")
  .post(
    guard(WRITE_CLASS),
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
        .withMessage("1 <= len <= 255"),
      body("*.school_id")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId"),
      body("*.member_ids").isArray().withMessage("must be array"),
      body("*.member_ids.*").isMongoId().withMessage("must be mongoId")
    ),
    writeItems
  )
  .delete(
    guard(DELETE_CLASS),
    validate(
      body()
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("*").isMongoId().withMessage("must be mongoId")
    ),
    delItems
  );

r.route("/:id")
  .get(
    guard(READ_CLASS),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    getUser
  )
  .patch()
  .delete(
    guard(DELETE_CLASS),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    delItem
  );
