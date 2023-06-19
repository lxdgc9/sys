import { Router } from "express";
import { ACCESS_SYSTEM } from "@lxdgc9/pkg/dist/rules/app";
import { guard } from "@lxdgc9/pkg/dist/handlers";
import readFile from "../handlers/upload/read";

const r = Router();

r.get("/*", guard(ACCESS_SYSTEM), readFile);

export default r;
