import { guard } from "@lxdgc9/pkg/dist/middleware";
import { Router } from "express";
import { readFile } from "../handlers/upload/read";

export const r = Router();

r.get("/*", guard(), readFile);
