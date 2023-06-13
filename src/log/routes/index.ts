import { Router } from "express";
import { param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { LOG } from "@lxdgc9/pkg/dist/rules/log";
import readParts from "../handlers/parts";
import readLogs from "../handlers/logs";

const logRouter = Router();

logRouter.get("/", guard(LOG), readParts);

logRouter.get(
  "/:part",
  guard(LOG),
  validator(param("part").isString().withMessage("must be string")),
  readLogs
);

export default logRouter;
