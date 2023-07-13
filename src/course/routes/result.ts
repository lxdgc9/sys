import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { Router } from "express";
import { patchResult } from "../handlers/result/patch";
import { getResult } from "../handlers/result/get-result";
import { body } from "express-validator";

const r = Router();

// Lấy thông tin bảng điểm theo lớp
r.get("/:class_id", guard(), getResult);
r.patch(
  "/:class_id",
  guard(),
  validator(
    body("user_id")
      .notEmpty()
      .withMessage("user_id is not empty")
      .isMongoId()
      .withMessage("Must be mongoid")
  ),
  patchResult
);

export default r;
