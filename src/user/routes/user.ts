import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_USER,
  WRITE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "@lxdgc9/pkg/dist/rules/manage";
import { ACCESS_SYSTEM } from "@lxdgc9/pkg/dist/rules/app";
import modifyPassword from "../handlers/user/modify-passwd";
import modifyAccess from "../handlers/user/modify-access";
import writeUser from "../handlers/user/write";
import modifyUser from "../handlers/user/modify";
import writeUsers from "../handlers/user/write-many";
import deleteUsers from "../handlers/user/delete-many";
import deleteUser from "../handlers/user/delete";
import readUsers from "../handlers/user/read-many";
import me from "../handlers/user/me";
import uploadAvt from "../handlers/user/upload-avt";
import login from "../handlers/auth/login";
import refreshToken from "../handlers/auth/refresh-token";
import readUser from "../handlers/user/read";
import uploader from "../helpers/upload";

const r = Router();

r.route("/")
  .get(guard(READ_USER), readUsers)
  .post(
    guard(WRITE_USER),
    validator(
      body("prof")
        .notEmpty()
        .withMessage("Not empty")
        .isObject()
        .withMessage("Must be object"),
      body("prof.username")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .trim()
        .toLowerCase()
        .escape(),
      body("prof.phone")
        .notEmpty()
        .withMessage("Not empty")
        .isMobilePhone("vi-VN")
        .withMessage("Invalid phone number")
        .escape(),
      body("prof.email")
        .notEmpty()
        .withMessage("Not empty")
        .isEmail()
        .withMessage("Must be email")
        .trim()
        .escape(),
      body("password")
        .notEmpty()
        .withMessage("Not empty")
        .isStrongPassword({
          minLength: 6,
          minSymbols: 0,
          minLowercase: 0,
          minUppercase: 0,
        })
        .withMessage("Password not strong enough"),
      body("role_id")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be mongoId"),
      body("spec_rule_ids")
        .optional({ values: "undefined" })
        .isArray()
        .withMessage("Must be array")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("spec_rule_ids.*")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("Must be mongoId"),
      body("is_active")
        .isBoolean()
        .withMessage("Must be boolean")
        .optional({ values: "undefined" })
    ),
    writeUser
  );

r.get("/me", guard(), me);
r.patch(
  "/upload-avt",
  guard(),
  uploader("/avatar").single("avatar"),
  uploadAvt
);

r.route("/many")
  .get(guard(READ_USER), readUsers)
  .post(
    guard(WRITE_USER),
    validator(
      body()
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.prof")
        .notEmpty()
        .withMessage("Not empty")
        .isObject()
        .withMessage("Must be object"),
      body("*.prof.username")
        .notEmpty()
        .withMessage("Not empty")
        .isString()
        .withMessage("Must be string")
        .trim()
        .toLowerCase()
        .escape(),
      body("*.prof.phone")
        .notEmpty()
        .withMessage("Not empty")
        .isMobilePhone("vi-VN")
        .withMessage("Invalid phone number")
        .escape(),
      body("*.prof.email")
        .notEmpty()
        .withMessage("Not empty")
        .isEmail()
        .withMessage("Must be email")
        .trim()
        .escape(),
      body("*.password")
        .notEmpty()
        .withMessage("Not empty")
        .isStrongPassword({
          minLength: 6,
          minSymbols: 0,
          minLowercase: 0,
          minUppercase: 0,
        })
        .withMessage("Password not strong enough"),
      body("*.role_id")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be mongoId"),
      body("*.spec_rule_ids")
        .optional({ values: "undefined" })
        .isArray()
        .withMessage("Must be array")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("users.*.is_active")
        .isBoolean()
        .withMessage("Must be boolean")
        .optional({ values: "undefined" })
    ),
    writeUsers
  )
  .delete(
    guard(DELETE_USER),
    validator(
      body()
        .notEmpty()
        .withMessage("Not empty")
        .isArray({ min: 1 })
        .withMessage("Should be at least 1 element")
        .customSanitizer((vals) => [...new Set(vals)]),
      body("*").isMongoId().withMessage("Must be mongoId")
    ),
    deleteUsers
  );

r.route("/:id")
  .get(
    guard(READ_USER),
    validator(param("id").isMongoId().withMessage("Must be mongoId")),
    readUser
  )
  .patch(
    guard(UPDATE_USER),
    validator(
      param("id").isMongoId().withMessage("Must be mongoId"),
      body("prof")
        .optional({ values: "undefined" })
        .isObject()
        .withMessage("Must be object")
        .custom((v) => {
          if (!Object.keys(v).length) {
            throw new Error("Object Must not be empty");
          }
          return true;
        }),
      body("prof.username")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
        .trim()
        .toLowerCase()
        .escape(),
      body("prof.phone")
        .optional({ values: "undefined" })
        .isMobilePhone("vi-VN")
        .withMessage("Invalid phone number")
        .escape(),
      body("prof.email")
        .optional({ values: "undefined" })
        .isMobilePhone("vi-VN")
        .isEmail()
        .withMessage("Must be email")
        .trim()
        .escape(),
      body("role_id")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("Must be mongoId"),
      body("spec_rule_ids")
        .optional({ values: "undefined" })
        .isArray()
        .withMessage("Must be array")
        .customSanitizer((vals) => [...new Set(vals)])
    ),
    modifyUser
  )
  .delete(
    guard(DELETE_USER),
    validator(param("id").isMongoId().withMessage("Must be mongoId")),
    deleteUser
  );

r.post(
  "/auth",
  validator(
    body("k")
      .notEmpty()
      .withMessage("Not empty")
      .isIn(["username", "phone", "email"])
      .withMessage("Invalid field, Must be username, phone or email")
      .escape(),
    body("v").notEmpty().withMessage("Not empty").escape(),
    body("password").notEmpty().withMessage("Not empty").escape()
  ),
  login
);

r.post(
  "/auth/refresh-token",
  validator(
    body("token")
      .notEmpty()
      .withMessage("Not empty")
      .isString()
      .withMessage("Must be string")
      .escape()
  ),
  refreshToken
);

r.patch(
  "/:id/password",
  guard(UPDATE_USER),
  validator(
    param("id").isMongoId().withMessage("Must be mongoId").escape(),
    body("old_password").notEmpty().withMessage("Not empty").escape(),
    body("new_password")
      .notEmpty()
      .withMessage("Not empty")
      .isStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      })
      .withMessage("Password not strong enough")
      .escape()
  ),
  modifyPassword
);

r.patch(
  "/:id/active",
  guard(UPDATE_USER),
  validator(
    param("id").isMongoId().withMessage("Must be mongoId"),
    body("status")
      .notEmpty()
      .withMessage("Not empty")
      .isBoolean()
      .withMessage("Must be boolean")
  ),
  modifyAccess
);

export default r;
