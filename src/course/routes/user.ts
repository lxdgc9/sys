import { Router } from "express";
import { param } from "express-validator";
import { validator } from "@lxdgc9/pkg/dist/handlers";
import { getUser } from "../handlers/user/read";
import { getUsers } from "../handlers/user/read-many";

export const r = Router();

r.get("/", getUsers);
r.get(
  "/:id",
  validator(param("id").isMongoId().withMessage("Must be mongoId")),
  getUser
);
