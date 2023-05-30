import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_USER,
  INSERT_USER,
  SEARCH_USER,
  UPDATE_USER,
} from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { delUser } from "../handler/del";
import { delUsers } from "../handler/del-n";
import { getUser } from "../handler/get";
import { getUsers } from "../handler/get-n";
import { login } from "../handler/login";
import { modUser } from "../handler/mod";
import { modPasswd } from "../handler/mod-pass";
import { newUser } from "../handler/new";
import { newUsers } from "../handler/new-n";
import { rtk } from "../handler/rtk";

export const r = Router();

r.route("/")
  .get(guard(SEARCH_USER), getUsers)
  .post(
    guard(INSERT_USER),
    validate(
      body("prof").notEmpty().isObject(),
      body("passwd").notEmpty().isStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      }),
      body("roleId").notEmpty().isMongoId(),
      body("active").isBoolean().optional({ values: "undefined" })
    ),
    newUser
  );

r.route("/many")
  .post(
    guard(INSERT_USER),
    validate(
      body("users").notEmpty().isArray().isLength({ min: 1 }),
      body("users.*.prof").notEmpty().isObject(),
      body("users.*.passwd").notEmpty().isStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      }),
      body("users.*.roleId").notEmpty().isMongoId(),
      body("users.*.active").isBoolean().optional({ values: "undefined" })
    ),
    newUsers
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
  .get(guard(SEARCH_USER), validate(param("id").isMongoId()), getUser)
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
