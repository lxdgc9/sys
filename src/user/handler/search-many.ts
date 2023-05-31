import { RequestHandler } from "express";
import { User } from "../model/user";

export const searchUsers: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      users: await User.find().populate({
        path: "role",
        select: "-perms",
      }),
    });
  } catch (e) {
    next(e);
  }
};
