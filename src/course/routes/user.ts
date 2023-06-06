import { validate } from "@lxdgc9/pkg/dist/middleware";
import { Router } from "express";
import { param } from "express-validator";
import { readItem } from "../handlers/user/read";
import { readItems } from "../handlers/user/read-many";

export const r = Router();

r.get("/", readItems);
r.get(
  "/:id",
  validate(param("id").isMongoId().withMessage("must be mongoId")),
  readItem
);
