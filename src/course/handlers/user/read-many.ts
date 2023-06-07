import { RequestHandler } from "express";
import { User } from "../../models/user";

export const readItems: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await User.find());
  } catch (e) {
    next(e);
  }
};
