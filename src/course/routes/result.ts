import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { Router } from "express";
import { patchResult } from "../handlers/result/patch";
import { getResult } from "../handlers/result/get-result";

const r = Router();

// Lấy thông tin bảng điểm theo lớp
r.get("/:class_id", guard(), validator(), getResult);
r.patch("/:class_id", guard(), validator(), patchResult);

export default r;
