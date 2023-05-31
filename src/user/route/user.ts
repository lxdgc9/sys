import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_USER,
  INSERT_USER,
  SEARCH_USER,
  UPDATE_USER,
} from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { delUser } from "../handler/delete";
import { delUsers } from "../handler/delete-many";
import { insertUser } from "../handler/insert";
import { insertUsers } from "../handler/insert-many";
import { login } from "../handler/login";
import { modUser } from "../handler/mod";
import { modPasswd } from "../handler/mod-pass";
import { rtk } from "../handler/rtk";
import { searchUser } from "../handler/search";
import { searchUsers } from "../handler/search-many";

export const r = Router();

r.route("/")
  .get(guard(SEARCH_USER), searchUsers)
  .post(
    guard(INSERT_USER),
    validate(
      body("prof")
        .notEmpty()
        .withMessage("required")
        .isObject()
        .withMessage("must be object"),
      body("prof.username")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
        .trim()
        .toLowerCase(),
      body("prof.phone")
        .notEmpty()
        .withMessage("required")
        .isMobilePhone("vi-VN")
        .withMessage("invalid phone number"),
      body("prof.email")
        .notEmpty()
        .withMessage("required")
        .isEmail()
        .withMessage("must be email")
        .trim(),
      body("passwd")
        .notEmpty()
        .isStrongPassword({
          minLength: 6,
          minSymbols: 0,
          minLowercase: 0,
          minUppercase: 0,
        })
        .withMessage("password not strong enough"),
      body("roleId")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId"),
      body("active")
        .isBoolean()
        .withMessage("must be boolean")
        .optional({ values: "undefined" })
    ),
    insertUser
  );

r.route("/many")
  .post(
    guard(INSERT_USER),
    validate(
      body("users")
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("users.*").isObject().withMessage("must be object"),
      body("users.*.prof")
        .notEmpty()
        .withMessage("required")
        .isObject()
        .withMessage("must be object"),
      body("users.*.prof.username")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
        .trim()
        .toLowerCase(),
      body("users.*.prof.phone")
        .notEmpty()
        .withMessage("required")
        .isMobilePhone("vi-VN")
        .withMessage("invalid phone number"),
      body("users.*.prof.email")
        .notEmpty()
        .withMessage("required")
        .isEmail()
        .withMessage("must be email")
        .trim(),
      body("users.*.passwd")
        .notEmpty()
        .isStrongPassword({
          minLength: 6,
          minSymbols: 0,
          minLowercase: 0,
          minUppercase: 0,
        })
        .withMessage("password not strong enough"),
      body("users.*.roleId")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId"),
      body("users.*.active")
        .isBoolean()
        .withMessage("must be boolean")
        .optional({ values: "undefined" })
    ),
    insertUsers
  )
  .delete(
    guard(DELETE_USER),
    validate(
      body("userIds").notEmpty().isArray({ min: 1 }),
      body("userIds.*").isMongoId()
    ),
    delUsers
  );

r.route("/:id")
  .get(
    guard(SEARCH_USER),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    searchUser
  )
  .patch(
    guard(UPDATE_USER),
    validate(
      param("id").isMongoId(),
      body("prof").optional({ values: "falsy" }).isObject(),
      body("roleId").optional({ values: "falsy" }).isMongoId(),
      body("active").optional({ values: "falsy" }).isBoolean()
    ),
    modUser
  )
  .delete(guard(DELETE_USER), validate(param("id").isMongoId()), delUser);

r.post(
  "/auth",
  validate(
    body("k").notEmpty(),
    body("v").notEmpty(),
    body("passwd").notEmpty()
  ),
  login
);

r.post("/auth/rtk", validate(body("token").notEmpty()), rtk);

r.patch(
  "/:id/passwd",
  guard(UPDATE_USER),
  validate(
    body("oldPasswd").notEmpty(),
    body("newPasswd").notEmpty().isStrongPassword({
      minLength: 6,
      minSymbols: 0,
      minLowercase: 0,
      minUppercase: 0,
    })
  ),
  modPasswd
);
