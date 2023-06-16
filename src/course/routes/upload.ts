import { Router } from "express";
import { guard } from "@lxdgc9/pkg/dist/handlers";
import readFile from "../handlers/upload/read";

const r = Router();

r.get("/*", guard(), readFile);

export default r;
