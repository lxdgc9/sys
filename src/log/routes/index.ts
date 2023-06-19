import { Router } from "express";
import { param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { ACCESS_LOG } from "@lxdgc9/pkg/dist/rules/app";
import readParts from "../handlers/parts";
import readLogs from "../handlers/logs";

const r = Router();

r.get("/", guard(ACCESS_LOG), readParts);

r.get(
  "/:part",
  guard(ACCESS_LOG),
  validator(param("part").isString().withMessage("Must be string")),
  readLogs
);

export default r;
