import { RequestHandler } from "express";
import { User } from "../../models/user";

const readUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await User.find().select("-schools -classes -courses");
    res.json(users);
  } catch (e) {
    next(e);
  }
};

export default readUsers;
