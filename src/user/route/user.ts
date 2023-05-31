import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_USER,
  INSERT_USER,
  SEARCH_USER,
  UPDATE_USER,
} from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { changePasswd } from "../handler/change-passwd";
import { deleteUser } from "../handler/delete";
import { deleteUsers } from "../handler/delete-many";
import { insertUser } from "../handler/insert";
import { insertUsers } from "../handler/insert-many";
import { login } from "../handler/login";
import { refreshToken } from "../handler/refresh-token";
import { searchUser } from "../handler/search";
import { searchUsers } from "../handler/search-many";
import { updateUser } from "../handler/update";
import { updateAccess } from "../handler/update-access";

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
        .withMessage("required")
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
        .withMessage("required")
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
      body("ids")
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("ids.*").isMongoId().withMessage("must be mongoId")
    ),
    deleteUsers
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
      param("id").isMongoId().withMessage("must be mongoId"),
      body("prof")
        .optional({ values: "undefined" })
        .isObject()
        .withMessage("must be object")
        .custom((v) => {
          if (!Object.keys(v).length) {
            throw new Error("Object must not be empty");
          }
          return true;
        }),
      body("prof.username")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
        .trim()
        .toLowerCase(),
      body("prof.phone")
        .optional({ values: "undefined" })
        .isMobilePhone("vi-VN")
        .withMessage("invalid phone number"),
      body("prof.email")
        .optional({ values: "undefined" })
        .isMobilePhone("vi-VN")
        .isEmail()
        .withMessage("must be email")
        .trim(),
      body("roleId")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("must be mongoId")
    ),
    updateUser
  )
  .delete(
    guard(DELETE_USER),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    deleteUser
  );

r.post(
  "/auth",
  validate(
    body("k")
      .notEmpty()
      .withMessage("required")
      .isIn(["username", "phone", "email"])
      .withMessage("invalid field, must be username, phone, email"),
    body("v").notEmpty().withMessage("required"),
    body("passwd").notEmpty().withMessage("required")
  ),
  login
);

r.post(
  "/auth/refresh-token",
  validate(
    body("token")
      .notEmpty()
      .withMessage("required")
      .isString()
      .withMessage("must be string")
  ),
  refreshToken
);

r.patch(
  "/:id/passwd",
  guard(UPDATE_USER),
  validate(
    param("id").isMongoId().withMessage("must be mongoId"),
    body("oldPasswd").notEmpty().withMessage("required"),
    body("newPasswd")
      .notEmpty()
      .withMessage("required")
      .isStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      })
      .withMessage("password not strong enough")
  ),
  changePasswd
);

r.patch(
  "/:id/active",
  guard(UPDATE_USER),
  validate(
    param("id").isMongoId().withMessage("must be mongoId"),
    body("status")
      .notEmpty()
      .withMessage("required")
      .isBoolean()
      .withMessage("must be boolean")
  ),
  updateAccess
);
