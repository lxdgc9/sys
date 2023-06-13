import { Router } from "express";
import { guard } from "@lxdgc9/pkg/dist/handlers";
import readFile from "../handlers/upload/read";

const uploadRouter = Router();

uploadRouter.get("/*", guard(), readFile);

export default uploadRouter;
