import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_CLASS,
  DELETE_SCHOOL,
  INSERT_CLASS,
  INSERT_SCHOOL,
  SEARCH_SCHOOL,
  UPDATE_CLASS,
  UPDATE_SCHOOL,
} from "@lxdgc9/pkg/dist/rule/course";
import { Router } from "express";
import { body, param } from "express-validator";
import { deleteClass } from "../handler/school/class/delete";
import { deleteClasses } from "../handler/school/class/delete-many";
import { insertClass } from "../handler/school/class/insert";
import { modClass } from "../handler/school/class/mod";
import { delUnit } from "../handler/school/del";
import { getUnits } from "../handler/school/get";
import { getUnit } from "../handler/school/get-id";
import { modUnit } from "../handler/school/mod";
import { newUnit } from "../handler/school/new";
import { allocUsers } from "../handler/school/user/alloc";
import { uploader } from "../helper/upload";

export const r = Router();

r.route("/classes")
  .post(
    guard(INSERT_CLASS),
    validate(
      body("name")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("schoolId")
        .notEmpty()
        .withMessage("required")
        .isMongoId()
        .withMessage("must be mongoId"),
      body("memberIds").isArray().withMessage("must be array"),
      body("memberIds.*").isMongoId().withMessage("must be mongoId")
    ),
    insertClass
  )
  .patch(guard(UPDATE_CLASS), modClass)
  .delete(
    guard(DELETE_CLASS),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    deleteClass
  );

r.route("/classes/many")
  .post(guard(), validate())
  .delete(guard(), validate(), deleteClasses);

r.route("/classes/:id");

r.patch("/users", guard(), allocUsers);

r.route("/")
  .get(guard(SEARCH_SCHOOL), getUnits)
  .post(
    guard(INSERT_SCHOOL),
    uploader("unit/logo").single("logo"),
    validate(
      body("code").notEmpty(),
      body("name").notEmpty(),
      body("addr").notEmpty(),
      body("desc")
        .optional({ values: "undefined" })
        .isLength({ min: 1, max: 255 })
    ),
    newUnit
  );
r.route("/:id")
  .get(validate(param("id").isMongoId()), guard(SEARCH_SCHOOL), getUnit)
  .patch(
    guard(UPDATE_SCHOOL),
    uploader("unit/logo").single("logo"),
    validate(param("id").isMongoId()),
    modUnit
  )
  .delete(validate(param("id").isMongoId()), guard(DELETE_SCHOOL), delUnit);
