import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import { LOG } from "@lxdgc9/pkg/dist/rule/log";
import { Router } from "express";
import { param } from "express-validator";
import { logs } from "../handler/logs";
import { searchParts } from "../handler/parts";

export const r = Router();

r.get("/", guard(LOG), searchParts);

r.get(
  "/:part",
  guard(LOG),
  validate(param("part").isString().withMessage("must be string")),
  logs
);
