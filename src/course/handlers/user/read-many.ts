import { RequestHandler } from "express";
import { User } from "../../models/user";

const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await User.find());
  } catch (e) {
    next(e);
  }
};

export default getUsers;
