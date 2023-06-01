import { RequestHandler } from "express";
import { User } from "../../model/user";

export const searchUsers: RequestHandler = async (req, res, next) => {
  try {
    res.json({
      users: await User.find().select("obj"),
    });
  } catch (e) {
    next(e);
  }
};
