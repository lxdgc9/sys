import { RequestHandler } from "express";
import { User } from "../../models/user";

const readUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await User.find().populate("role", "-rules");
    res.json(users);
  } catch (e) {
    next(e);
  }
};

export default readUsers;
