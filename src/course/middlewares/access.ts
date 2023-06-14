import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../models/user";

const access: RequestHandler = async (req, _res, next) => {
  if (!req.user) {
    if (process.env.NODE_ENV === "dev") {
      return next();
    }

    throw new UnauthorizedErr("Permission denied");
  }

  const sid = req.headers["sid"]?.toString() as unknown as Types.ObjectId;

  try {
    if (!sid) {
      throw new UnauthorizedErr("Permission denied");
    }

    const user = await User.findOne({ user_id: req.user.id });
    if (!user?.schools.includes(sid)) {
      throw new BadReqErr("Permission denied");
    }

    next();
  } catch (e) {
    next(e);
  }
};

export default access;
