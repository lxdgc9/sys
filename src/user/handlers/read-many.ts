import { RequestHandler } from "express";
import { User } from "../models/user";

export const readUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await User.find().populate({
      path: "role",
      select: "-perms",
    });
    res.json({ users });
  } catch (e) {
    next(e);
  }
};
