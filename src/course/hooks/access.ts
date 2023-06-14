import { RequestHandler } from "express";
import { Types } from "mongoose";
import { ForbiddenErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      school_ids?: Types.ObjectId[];
    }
  }
}

const parse: RequestHandler = async (req, _res, next) => {
  if (!req.user) {
    if (process.env.NODE_ENV === "dev") {
      return next();
    }

    throw new ForbiddenErr("Permission denied");
  }

  try {
    const user = await User.findOne({ user_id: req.user.id });
    req.school_ids = user?.schools;
    next();
  } catch (e) {
    next(e);
  }
};

export default parse;
