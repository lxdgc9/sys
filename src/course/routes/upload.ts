import { guard } from "@lxdgc9/pkg/dist/middleware";
import { Router } from "express";
import { getFile } from "../handlers/upload/get";

export const r = Router();

r.get("/*", guard(), getFile);
