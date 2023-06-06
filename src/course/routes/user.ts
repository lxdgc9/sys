import { validate } from "@lxdgc9/pkg/dist/middleware";
import { Router } from "express";
import { param } from "express-validator";
import { getItem } from "../handlers/user/search";
import { getItems } from "../handlers/user/search-many";

export const r = Router();

r.get("/", getItems);
r.get(
  "/:id",
  validate(param("id").isMongoId().withMessage("must be mongoId")),
  getItem
);
