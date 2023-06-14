import { Router } from "express";
import { body, param } from "express-validator";
import { guard, validator } from "@lxdgc9/pkg/dist/handlers";
import readUsers from "../handlers/user/read-many";
import readUser from "../handlers/user/read";
import allocUser from "../handlers/user/alloc";
import allocUsers from "../handlers/user/alloc-many";

const userRouter = Router();

userRouter
  .route("/")
  .get(readUsers)
  .patch(
    guard(),
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
userRouter
  .route("/many")
  .patch(
    guard(),
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
userRouter.get(
  "/:id",
  validator(param("id").isMongoId().withMessage("Must be MongoId")),
  readUser
);

export default userRouter;
