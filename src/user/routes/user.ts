import { Router } from "express";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_USER,
  WRITE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "@lxdgc9/pkg/dist/rules/manage";
import { body, param } from "express-validator";
import modifyPassword from "../handlers/user/modify-passwd";
import modifyAccess from "../handlers/user/modify-access";
import writeUser from "../handlers/user/write";
import modifyUser from "../handlers/user/modify";
import writeUsers from "../handlers/user/write-many";
import deleteUsers from "../handlers/user/delete-many";
import delUser from "../handlers/user/delete";
import readUsers from "../handlers/user/read-many";
import login from "../handlers/auth/login";
import refreshToken from "../handlers/auth/refresh-token";
import readUser from "../handlers/user/read";

const r = Router();

r.route("/")
  .get(guard(READ_USER), readUsers)
  .post(
    guard(WRITE_USER),
    validator(
      body("prof")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isObject()
        .withMessage("Phải là Object"),
      body("prof.username")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
        .trim()
        .toLowerCase(),
      body("prof.phone")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isMobilePhone("vi-VN")
        .withMessage("invalid phone number"),
      body("prof.email")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isEmail()
        .withMessage("Must be email")
        .trim(),
      body("password")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isStrongPassword({
          minLength: 6,
          minSymbols: 0,
          minLowercase: 0,
          minUppercase: 0,
        })
        .withMessage("password not strong enough"),
      body("role_id")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isMongoId()
        .withMessage("Định dạng không hợp lệ"),
      body("is_active")
        .isBoolean()
        .withMessage("Must be boolean")
        .optional({ values: "undefined" })
    ),
    writeUser
  );

r.route("/many")
  .get(guard(READ_USER), readUsers)
  .post(
    guard(WRITE_USER),
    validator(
      body()
        .notEmpty()
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Must be array, has aleast 1 element"),
      body("*").isObject().withMessage("Phải là Object"),
      body("*.prof")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isObject()
        .withMessage("Phải là Object"),
      body("*.prof.username")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isString()
        .withMessage("Phải là chuỗi")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
        .trim()
        .toLowerCase(),
      body("*.prof.phone")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isMobilePhone("vi-VN")
        .withMessage("invalid phone number"),
      body("*.prof.email")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isEmail()
        .withMessage("Must be email")
        .trim(),
      body("*.passwd")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isStrongPassword({
          minLength: 6,
          minSymbols: 0,
          minLowercase: 0,
          minUppercase: 0,
        })
        .withMessage("password not strong enough"),
      body("*.role_id")
        .notEmpty()
        .withMessage("Bắt buộc")
        .isMongoId()
        .withMessage("Định dạng không hợp lệ"),
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
        .withMessage("Bắt buộc")
        .isArray({ min: 1 })
        .withMessage("Must be array, has aleast 1 element"),
      body("*").isMongoId().withMessage("Định dạng không hợp lệ")
    ),
    deleteUsers
  );

r.route("/:id")
  .get(
    guard(READ_USER),
    validator(param("id").isMongoId().withMessage("Định dạng không hợp lệ")),
    readUser
  )
  .patch(
    guard(UPDATE_USER),
    validator(
      param("id").isMongoId().withMessage("Định dạng không hợp lệ"),
      body("prof")
        .optional({ values: "undefined" })
        .isObject()
        .withMessage("Phải là Object")
        .custom((v) => {
          if (!Object.keys(v).length) {
            throw new Error("Object Must not be empty");
          }
          return true;
        }),
      body("prof.username")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("Phải là chuỗi")
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
        .withMessage("Must be email")
        .trim(),
      body("role_id")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("Định dạng không hợp lệ")
    ),
    modifyUser
  )
  .delete(
    guard(DELETE_USER),
    validator(param("id").isMongoId().withMessage("Định dạng không hợp lệ")),
    delUser
  );

r.post(
  "/auth",
  validator(
    body("k")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isIn(["username", "phone", "email"])
      .withMessage("Invalid field, Must be username, phone or email"),
    body("v").notEmpty().withMessage("Bắt buộc"),
    body("password").notEmpty().withMessage("Bắt buộc")
  ),
  login
);

r.post(
  "/auth/refresh-token",
  validator(
    body("token")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isString()
      .withMessage("Phải là chuỗi")
  ),
  refreshToken
);

r.patch(
  "/:id/passwd",
  guard(UPDATE_USER),
  validator(
    param("id").isMongoId().withMessage("Định dạng không hợp lệ"),
    body("old_password").notEmpty().withMessage("Bắt buộc"),
    body("new_password")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      })
      .withMessage("Password not strong enough")
  ),
  modifyPassword
);

r.patch(
  "/:id/active",
  guard(UPDATE_USER),
  validator(
    param("id").isMongoId().withMessage("Định dạng không hợp lệ"),
    body("status")
      .notEmpty()
      .withMessage("Bắt buộc")
      .isBoolean()
      .withMessage("Must be boolean")
  ),
  modifyAccess
);

export default r;
