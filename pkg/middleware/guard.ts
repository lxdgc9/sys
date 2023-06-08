import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import { Types } from "mongoose";
import { ForbiddenErr, UnauthorizedErr } from "../err";

export interface JwtPayload {
  id: Types.ObjectId;
  perms: string[];
  is_active: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function guard(...perms: string[]) {
  const _: RequestHandler = (req, _res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      if (process.env.NODE_ENV === "dev") {
        return next();
      }
      throw new UnauthorizedErr("require token");
    }

    try {
      req.user = verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

      if (!req.user.is_active) {
        throw new ForbiddenErr("access denied");
      }

      if (perms.length && !req.user.perms.some((p) => perms.includes(p))) {
        throw new ForbiddenErr("permission denied");
      }
      next();
    } catch (e) {
      next(e);
    }
  };

  return _;
}
