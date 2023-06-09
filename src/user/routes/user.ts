import { guard, validate } from "@lxdgc9/pkg/dist/handlers";
import {
  DELETE_USER,
  READ_USER,
  UPDATE_USER,
  WRITE_USER,
} from "@lxdgc9/pkg/dist/rules/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { changePasswd } from "../handlers/change-passwd";
import { delItem } from "../handlers/delete";
import { delItems } from "../handlers/delete-many";
import { login } from "../handlers/login";
import { readUser } from "../handlers/read";
import { readUsers } from "../handlers/read-many";
import { refreshToken } from "../handlers/refresh-token";
import { updateItem } from "../handlers/update";
import { changeAccess } from "../handlers/update-access";
import { writeItem } from "../handlers/write";
import { writeItems } from "../handlers/write-many";

export const r = Router();

r.route("/")
  .get(guard(READ_USER), readUsers)
  .post(
    guard(WRITE_USER),
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
      body("role_id")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId"),
      body("is_active")
        .isBoolean()
        .withMessage("must be boolean")
        .optional({ values: "undefined" })
    ),
    writeItem
  );

r.route("/many")
  .post(
    guard(WRITE_USER),
    validate(
      body()
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("*").isObject().withMessage("must be object"),
      body("*.prof")
        .notEmpty()
        .withMessage("required")
        .isObject()
        .withMessage("must be object"),
      body("*.prof.username")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
        .trim()
        .toLowerCase(),
      body("*.prof.phone")
        .notEmpty()
        .withMessage("required")
        .isMobilePhone("vi-VN")
        .withMessage("invalid phone number"),
      body("*.prof.email")
        .notEmpty()
        .withMessage("required")
        .isEmail()
        .withMessage("must be email")
        .trim(),
      body("*.passwd")
        .notEmpty()
        .withMessage("required")
        .isStrongPassword({
          minLength: 6,
          minSymbols: 0,
          minLowercase: 0,
          minUppercase: 0,
        })
        .withMessage("password not strong enough"),
      body("*.role_id")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId"),
      body("users.*.is_active")
        .isBoolean()
        .withMessage("must be boolean")
        .optional({ values: "undefined" })
    ),
    writeItems
  )
  .delete(
    guard(DELETE_USER),
    validate(
      body()
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("*").isMongoId().withMessage("must be mongoId")
    ),
    delItems
  );

r.route("/:id")
  .get(
    guard(READ_USER),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    readUser
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
      body("role_id")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("must be mongoId")
    ),
    updateItem
  )
  .delete(
    guard(DELETE_USER),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    delItem
  );

r.post(
  "/auth",
  validate(
    body("k")
      .notEmpty()
      .withMessage("required")
      .isIn(["username", "phone", "email"])
      .withMessage("invalid field, must be username, phone or email"),
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
  changeAccess
);
