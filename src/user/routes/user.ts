import { Router } from "express";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import {
  READ_USER,
  WRITE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "@lxdgc9/pkg/dist/rules/manage";
import { body, param } from "express-validator";
import changePassword from "../handlers/user/change-passwd";
import changeAccess from "../handlers/user/update-access";
import writeUser from "../handlers/user/write";
import updateUser from "../handlers/user/update";
import writeUsers from "../handlers/user/write-many";
import delUsers from "../handlers/user/delete-many";
import delUser from "../handlers/user/delete";
import readUsers from "../handlers/auth/read-many";
import login from "../handlers/auth/login";
import refreshToken from "../handlers/auth/refresh-token";
import readUser from "../handlers/auth/read";

const userRouter = Router();

userRouter
  .route("/")
  .get(guard(READ_USER), readUsers)
  .post(
    guard(WRITE_USER),
    validator(
      body("prof")
        .notEmpty()
        .withMessage("Required")
        .isObject()
        .withMessage("Must be object"),
      body("prof.username")
        .notEmpty()
        .withMessage("Required")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
        .trim()
        .toLowerCase(),
      body("prof.phone")
        .notEmpty()
        .withMessage("Required")
        .isMobilePhone("vi-VN")
        .withMessage("invalid phone number"),
      body("prof.email")
        .notEmpty()
        .withMessage("Required")
        .isEmail()
        .withMessage("Must be email")
        .trim(),
      body("password")
        .notEmpty()
        .withMessage("Required")
        .isStrongPassword({
          minLength: 6,
          minSymbols: 0,
          minLowercase: 0,
          minUppercase: 0,
        })
        .withMessage("password not strong enough"),
      body("role_id")
        .notEmpty()
        .withMessage("Required")
        .isMongoId()
        .withMessage("Must be mongoId"),
      body("is_active")
        .isBoolean()
        .withMessage("Must be boolean")
        .optional({ values: "undefined" })
    ),
    writeUser
  );

userRouter
  .route("/many")
  .get(guard(READ_USER), readUsers)
  .post(
    guard(WRITE_USER),
    validator(
      body()
        .notEmpty()
        .withMessage("Required")
        .isArray({ min: 1 })
        .withMessage("Must be array, has aleast 1 element"),
      body("*").isObject().withMessage("Must be object"),
      body("*.prof")
        .notEmpty()
        .withMessage("Required")
        .isObject()
        .withMessage("Must be object"),
      body("*.prof.username")
        .notEmpty()
        .withMessage("Required")
        .isString()
        .withMessage("Must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
        .trim()
        .toLowerCase(),
      body("*.prof.phone")
        .notEmpty()
        .withMessage("Required")
        .isMobilePhone("vi-VN")
        .withMessage("invalid phone number"),
      body("*.prof.email")
        .notEmpty()
        .withMessage("Required")
        .isEmail()
        .withMessage("Must be email")
        .trim(),
      body("*.passwd")
        .notEmpty()
        .withMessage("Required")
        .isStrongPassword({
          minLength: 6,
          minSymbols: 0,
          minLowercase: 0,
          minUppercase: 0,
        })
        .withMessage("password not strong enough"),
      body("*.role_id")
        .notEmpty()
        .withMessage("Required")
        .isMongoId()
        .withMessage("Must be mongoId"),
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
        .withMessage("Required")
        .isArray({ min: 1 })
        .withMessage("Must be array, has aleast 1 element"),
      body("*").isMongoId().withMessage("Must be mongoId")
    ),
    delUsers
  );

userRouter
  .route("/:id")
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
        .withMessage("Must be mongoId")
    ),
    updateUser
  )
  .delete(
    guard(DELETE_USER),
    validator(param("id").isMongoId().withMessage("Must be mongoId")),
    delUser
  );

userRouter.post(
  "/auth",
  validator(
    body("k")
      .notEmpty()
      .withMessage("Required")
      .isIn(["username", "phone", "email"])
      .withMessage("Invalid field, Must be username, phone or email"),
    body("v").notEmpty().withMessage("Required"),
    body("password").notEmpty().withMessage("Required")
  ),
  login
);

userRouter.post(
  "/auth/refresh-token",
  validator(
    body("token")
      .notEmpty()
      .withMessage("Required")
      .isString()
      .withMessage("Must be string")
  ),
  refreshToken
);

userRouter.patch(
  "/:id/passwd",
  guard(UPDATE_USER),
  validator(
    param("id").isMongoId().withMessage("Must be mongoId"),
    body("old_password").notEmpty().withMessage("Required"),
    body("new_password")
      .notEmpty()
      .withMessage("Required")
      .isStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      })
      .withMessage("Password not strong enough")
  ),
  changePassword
);

userRouter.patch(
  "/:id/active",
  guard(UPDATE_USER),
  validator(
    param("id").isMongoId().withMessage("Must be mongoId"),
    body("status")
      .notEmpty()
      .withMessage("Required")
      .isBoolean()
      .withMessage("Must be boolean")
  ),
  changeAccess
);

export default userRouter;
