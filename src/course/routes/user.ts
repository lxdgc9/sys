import { Router } from "express";
import { param } from "express-validator";
import { validator } from "@lxdgc9/pkg/dist/handlers";
import readUsers from "../handlers/user/read-many";
import readUser from "../handlers/user/read";

const userRouter = Router();

userRouter.get("/", readUsers);
userRouter.get(
  "/:id",
  validator(param("id").isMongoId().withMessage("Must be MongoId")),
  readUser
);

export default userRouter;
