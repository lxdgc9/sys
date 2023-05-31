import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_ROLE,
  INSERT_ROLE,
  SEARCH_ROLE,
  UPDATE_ROLE,
} from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { deleteRole } from "../handler/role/delete";
import { deleteRoles } from "../handler/role/delete-many";
import { insertRole } from "../handler/role/insert";
import { insertRoles } from "../handler/role/insert-many";
import { searchRole } from "../handler/role/search";
import { searchRoles } from "../handler/role/search-many";
import { updateRole } from "../handler/role/update";

export const r = Router();

r.route("/")
  .get(guard(SEARCH_ROLE), searchRoles)
  .post(
    guard(INSERT_ROLE),
    validate(
      body("name")
        .notEmpty()
        .withMessage("required")
        .withMessage({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("level").isInt({ min: 0 }).withMessage("must be number, >= 0"),
      body("permIds")
        .notEmpty()
        .withMessage("required")
        .isArray()
        .withMessage("must be array"),
      body("permIds.*").isMongoId().withMessage("must be mongoId")
    ),
    insertRole
  );

r.route("/many")
  .post(
    guard(INSERT_ROLE),
    validate(
      body("roles")
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("roles.*").isObject().withMessage("must be object"),
      body("roles.*.name")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("roles.*.level")
        .isInt({ min: 0 })
        .withMessage("must be number, >= 0"),
      body("roles.*.permIds")
        .isArray()
        .withMessage("must be array")
        .isMongoId()
        .withMessage("must be mongoId")
    ),
    insertRoles
  )
  .delete(
    guard(DELETE_ROLE),
    validate(
      body("ids")
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("ids.*").isMongoId().withMessage("must be mongoId")
    ),
    deleteRoles
  );

r.route("/:id")
  .get(
    guard(SEARCH_ROLE),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    searchRole
  )
  .patch(
    guard(UPDATE_ROLE),
    validate(
      param("id").isMongoId().withMessage("must be mongoId"),
      body("permIds").optional({ values: "undefined" }).isArray({ min: 1 }),
      body("permIds.*").isMongoId()
    ),
    updateRole
  )
  .delete(guard(DELETE_ROLE), validate(param("id").isMongoId()), deleteRole);
