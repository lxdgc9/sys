import { RequestHandler } from "express";
import { User } from "../models/user";

export const readItems: RequestHandler = async (_req, res, next) => {
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
