import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import { ACCESS_COURSE } from "@lxdgc9/pkg/dist/rules/app";
import { ALLOC_USER } from "@lxdgc9/pkg/dist/rules/course";
import readUsers from "../handlers/user/read-many";
import readUser from "../handlers/user/read";
import allocUser from "../handlers/user/alloc";
import allocUsers from "../handlers/user/alloc-many";
import grantUserToClass from "../handlers/user/grant-class";
import grantUsersToClass from "../handlers/user/grant-many-class";

const r = Router();

r.route("/")
  .get(guard(ACCESS_COURSE), readUsers)
  .patch(
    guard(ALLOC_USER),
    validator(
      body("user_id")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be MongoId"),
      body("school_id")
        .notEmpty()
        .withMessage("Not empty")
        .isMongoId()
        .withMessage("Must be MongoId")
    ),
    allocUser
  );

r.route("/many").patch(
  guard(ALLOC_USER),
  validator(
    body("user_ids")
      .notEmpty()
      .withMessage("Not empty")
      .isArray({ min: 1 })
      .withMessage("Should be at least 1 element"),
    body("user_ids.*").isMongoId().withMessage("Must be MongoId"),
    body("school_id")
      .notEmpty()
      .withMessage("Not empty")
      .isMongoId()
      .withMessage("Must be MongoId")
  ),
  allocUsers
);

r.get(
  "/:id",
  guard(ACCESS_COURSE),
  validator(param("id").isMongoId().withMessage("Must be MongoId")),
  readUser
);

r.patch(
  "/alloc-to-class",
  guard(ALLOC_USER),
  validator(
    body("user_id")
      .notEmpty()
      .withMessage("Not empty")
      .isMongoId()
      .withMessage("Must be mongoId"),
    body("class_id")
      .notEmpty()
      .withMessage("Not empty")
      .isMongoId()
      .withMessage("Must be mongoId")
  ),
  grantUserToClass
);

r.patch(
  "/alloc-many-to-class",
  guard(ALLOC_USER),
  validator(
    body("user_ids")
      .notEmpty()
      .withMessage("Not empty")
      .isArray({ min: 1 })
      .withMessage("Should be at least 1 element"),
    body("user_ids.*").isMongoId().withMessage("Must be mongoId"),
    body("class_id")
      .notEmpty()
      .withMessage("Not empty")
      .isMongoId()
      .withMessage("Must be mongoId")
  ),
  grantUsersToClass
);

export default r;
