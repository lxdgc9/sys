import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_PERM,
  INSERT_PERM,
  SEARCH_PERM,
  UPDATE_PERM,
} from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { deletePerm } from "../handler/role/perm/delete";
import { deletePerms } from "../handler/role/perm/delete-many";
import { deleteGroup } from "../handler/role/perm/group/delete";
import { deleteGroups } from "../handler/role/perm/group/delete-many";
import { insertGroup } from "../handler/role/perm/group/insert";
import { insertGroups } from "../handler/role/perm/group/insert-many";
import { searchGroup } from "../handler/role/perm/group/search";
import { searchGroups } from "../handler/role/perm/group/search-many";
import { updateGroup } from "../handler/role/perm/group/update";
import { insertPerm } from "../handler/role/perm/insert";
import { insertPerms } from "../handler/role/perm/insert-many";
import { searchPerm } from "../handler/role/perm/search";
import { getPerms } from "../handler/role/perm/search-many";
import { updatePerm } from "../handler/role/perm/update";

export const r = Router();

r.route("/group")
  .get(guard(SEARCH_PERM), searchGroups)
  .post(
    guard(INSERT_PERM),
    validate(
      body("name")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    insertGroup
  );

r.route("/group/many")
  .post(
    guard(INSERT_PERM),
    validate(
      body("groups")
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("groups.*").isObject().withMessage("must be object"),
      body("groups.*.name")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    insertGroups
  )
  .delete(
    guard(DELETE_PERM),
    validate(
      body("ids")
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("ids.*").isMongoId().withMessage("must be mongoId")
    ),
    deleteGroups
  );

r.route("/group/:id")
  .get(
    guard(SEARCH_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    searchGroup
  )
  .patch(
    guard(UPDATE_PERM),
    validate(
      param("id").isMongoId().withMessage("must be mongoId"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("permIds")
        .optional({ values: "undefined" })
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("permIds.*").isMongoId().withMessage("must be mongoId")
    ),
    updateGroup
  )
  .delete(
    guard(DELETE_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    deleteGroup
  );

r.route("/")
  .get(guard(SEARCH_PERM), getPerms)
  .post(
    guard(INSERT_PERM),
    validate(
      body("code")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("desc")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("groupId")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId")
    ),
    insertPerm
  );

r.route("/many")
  .post(
    guard(INSERT_PERM),
    validate(
      body("perms")
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("perms.*").isObject().withMessage("must be object"),
      body("perms.*.code")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("perms.*.desc")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("perms.*.groupId").isMongoId().withMessage("must be mongoId")
    ),
    insertPerms
  )
  .delete(
    guard(DELETE_PERM),
    validate(
      body("ids")
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("ids.*").isMongoId().withMessage("must be mongoId")
    ),
    deletePerms
  );

r.route("/:id")
  .get(
    guard(SEARCH_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    searchPerm
  )
  .patch(
    guard(UPDATE_PERM),
    validate(
      param("id").isMongoId().withMessage("must be mongoId"),
      body("code")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("desc")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 }),
      body("groupId")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("must be mongoId")
    ),
    updatePerm
  )
  .delete(
    guard(DELETE_PERM),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    deletePerm
  );
