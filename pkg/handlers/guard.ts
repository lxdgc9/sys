import { RequestHandler } from "express";
import { Types } from "mongoose";
import jwt, { Secret } from "jsonwebtoken";
import { ForbiddenErr, UnauthorizedErr } from "../err";

export interface JwtPayload {
  id: Types.ObjectId;
  rules: string[];
  is_active: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function guard(...rules: string[]) {
  const handler: RequestHandler = (req, _res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      if (process.env.NODE_ENV === "dev") {
        return next();
      }

      throw new UnauthorizedErr("Require token");
    }

    try {
      req.user = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as Secret
      ) as JwtPayload;

      if (!req.user.is_active) {
        throw new ForbiddenErr("Access denied");
      }

      if (rules.length > 0 && !req.user.rules.some((r) => rules.includes(r))) {
        throw new ForbiddenErr("Permission denied");
      }

      next();
    } catch (err) {
      next(err);
    }
  };

  return handler;
}
