import { validate } from "@lxdgc9/pkg/dist/handlers";
import { Router } from "express";
import { param } from "express-validator";
import { getUser } from "../handlers/user/read";
import { getUsers } from "../handlers/user/read-many";

export const r = Router();

r.get("/", getUsers);
r.get(
  "/:id",
  validate(param("id").isMongoId().withMessage("must be mongoId")),
  getUser
);
