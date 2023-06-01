import { validate } from "@lxdgc9/pkg/dist/middleware";
import { Router } from "express";
import { param } from "express-validator";
import { searchUser } from "../handler/user/search";
import { searchUsers } from "../handler/user/search-many";

export const r = Router();

r.get("/", searchUsers);
r.get(
  "/:id",
  validate(param("id").isMongoId().withMessage("must be mongoId")),
  searchUser
);
