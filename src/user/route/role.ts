import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_ROLE,
  INSERT_ROLE,
  SEARCH_ROLE,
  UPDATE_ROLE,
} from "@lxdgc9/pkg/dist/rule/manage";
import { Router } from "express";
import { body, param } from "express-validator";
import { delRole } from "../handler/role/del";
import { getRoles } from "../handler/role/get";
import { getRole } from "../handler/role/get-id";
import { modRole } from "../handler/role/mod";
import { newRole } from "../handler/role/new";

export const r = Router();

r.route("/")
  .get(guard(SEARCH_ROLE), getRoles)
  .post(
    guard(INSERT_ROLE),
    validate(
      body("name").notEmpty(),
      body("permIds").isArray({ min: 1 }),
      body("permIds.*").isMongoId()
    ),
    newRole
  );
r.route("/:id")
  .get(guard(SEARCH_ROLE), validate(param("id").isMongoId()), getRole)
  .patch(
    guard(UPDATE_ROLE),
    validate(
      param("id").isMongoId(),
      body("permIds").optional({ values: "undefined" }).isArray({ min: 1 }),
      body("permIds.*").isMongoId()
    ),
    modRole
  )
  .delete(guard(DELETE_ROLE), validate(param("id").isMongoId()), delRole);
