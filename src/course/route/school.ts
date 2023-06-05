import { guard, validate } from "@lxdgc9/pkg/dist/middleware";
import {
  DELETE_CLASS,
  DELETE_SCHOOL,
  READ_CLASS,
  READ_SCHOOL,
  UPDATE_CLASS,
  UPDATE_SCHOOL,
  WRITE_CLASS,
  WRITE_SCHOOL,
} from "@lxdgc9/pkg/dist/rule/course";
import { Router } from "express";
import { body, param } from "express-validator";
import { delItem } from "../handler/school/class/delete";
import { delItems } from "../handler/school/class/delete-many";
import { insrtItem } from "../handler/school/class/insert";
import { insrtItems } from "../handler/school/class/insert-many";
import { getItems } from "../handler/school/class/seach-many";
import { getItem } from "../handler/school/class/search";
import { updateItem } from "../handler/school/class/update";
import { deleteSchool } from "../handler/school/delete";
import { deleteSchools } from "../handler/school/delete-many";
import { insertSchool } from "../handler/school/insert";
import { getSchool } from "../handler/school/search";
import { searchSchools } from "../handler/school/search-many";
import { updateSchool } from "../handler/school/update";
import { allocUser } from "../handler/school/user/alloc";
import { uploader } from "../helpers/upload";

export const r = Router();

r.route("/classes")
  .get(guard(READ_CLASS), getItems)
  .post(
    guard(WRITE_CLASS),
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
    insrtItem
  )
  .patch(guard(UPDATE_CLASS), updateItem)
  .delete(
    guard(DELETE_CLASS),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    delItem
  );

r.route("/classes/many")
  .post(
    guard(WRITE_CLASS),
    validate(
      body("classes")
        .notEmpty()
        .withMessage("required")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("classes.*").isObject().withMessage("must be object"),
      body("classes.*.name")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("classes.*.schoolId").isMongoId().withMessage("must be mongoId"),
      body("classes.*.memberIds").isArray().withMessage("must be array"),
      body("classes.*.memberIds.*").isMongoId().withMessage("must be mongoId")
    ),
    insrtItems
  )
  .delete(
    guard(DELETE_CLASS),
    validate(
      body("ids")
        .isArray({ min: 1 })
        .withMessage("must be array, has aleast 1 element"),
      body("ids.*").isMongoId().withMessage("must be mongoId")
    ),
    delItems
  );

r.route("/classes/:id")
  .get(
    guard(READ_CLASS),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    getItem
  )
  .patch()
  .delete(
    guard(DELETE_CLASS),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    delItem
  );

r.patch("/users", guard(), allocUser);

r.route("/")
  .get(guard(READ_SCHOOL), searchSchools)
  .post(
    guard(WRITE_SCHOOL),
    uploader("school/logo").single("logo"),
    validate(
      body("code")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("name")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("addr")
        .notEmpty()
        .withMessage("required")
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("desc")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    insertSchool
  );

r.delete(
  "/many",
  guard(DELETE_SCHOOL),
  validate(
    body("ids")
      .isArray({ min: 1 })
      .withMessage("must be array, has aleast 1 element"),
    body("ids.*").isMongoId().withMessage("must be mongoId")
  ),
  deleteSchools
);

r.route("/:id")
  .get(
    guard(READ_SCHOOL),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    getSchool
  )
  .patch(
    guard(UPDATE_SCHOOL),
    uploader("unit/logo").single("logo"),
    validate(
      param("id").isMongoId().withMessage("must be mongoId"),
      body("code")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("name")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("addr")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255"),
      body("desc")
        .optional({ values: "undefined" })
        .isString()
        .withMessage("must be string")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= len <= 255")
    ),
    updateSchool
  )
  .delete(
    guard(DELETE_SCHOOL),
    validate(param("id").isMongoId().withMessage("must be mongoId")),
    deleteSchool
  );
