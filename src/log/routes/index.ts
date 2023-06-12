import { Router } from "express";
import { param } from "express-validator";
import { guard, validate } from "@lxdgc9/pkg/dist/handlers";
import { LOG } from "@lxdgc9/pkg/dist/rules/log";
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
