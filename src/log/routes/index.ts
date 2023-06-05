import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import { LOG } from "@lxdgc9/pkg/dist/rule/log";
import { Router } from "express";
import { param } from "express-validator";
import { readLogs } from "../handlers/logs";
import { readParts } from "../handlers/parts";

export const r = Router();

r.get("/", guard(LOG), readParts);

r.get(
  "/:part",
  guard(LOG),
  validate(param("part").isString().withMessage("must be string")),
  readLogs
);
