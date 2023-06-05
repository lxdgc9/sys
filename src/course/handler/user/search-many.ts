import { RequestHandler } from "express";
import { User } from "../../models/user";

export const getItems: RequestHandler = async (req, res, next) => {
  try {
    res.json({
      users: await User.find({}, "obj"),
    });
  } catch (e) {
    next(e);
  }
};
