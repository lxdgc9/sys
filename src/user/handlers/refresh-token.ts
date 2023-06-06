import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { JwtPayload } from "@lxdgc9/pkg/dist/middleware";
import { RequestHandler } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from "../models/user";
import { redis } from "../redis";

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { id } = verify(
      req.body,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    const storedTk = await redis.get(`rf-tkn.${id}`);
    if (storedTk !== req.body) {
      throw new UnauthorizedErr("require login, can't refresh token");
    }

    const user = await User.findById(id).populate<{
      role: {
        perms: {
          code: string;
        }[];
      };
    }>({
      path: "role",
      populate: {
        path: "perms",
        select: "-perm_grp",
      },
    });
    if (!user) {
      throw new UnauthorizedErr("invalid token");
    }

    const accessToken = sign(
      {
        id: user._id,
        perms: user.role.perms.map((p) => p.code),
        active: user.is_active,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 900, // 15*60s
      }
    );
    const refreshToken = sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: 36288000, // 3600*24*60*7s
      }
    );

    res.json({
      accessToken,
      refreshToken,
    });

    await redis.set(`rf-tkn.${id}`, refreshToken, {
      EX: 36288001, // 1 + 3600*24*60*7s
    });
  } catch (e) {
    next(e);
  }
};
