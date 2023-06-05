import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";
import { User } from "../models/user";
import { redis } from "../redis";

export const login: RequestHandler = async (req, res, next) => {
  const {
    k,
    v,
    passwd,
  }: {
    k: string;
    v: string;
    passwd: string;
  } = req.body;

  try {
    const user = await User.findOne({
      attrs: {
        $elemMatch: { k, v },
      },
    }).populate<{
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
      throw new UnauthorizedErr("user not found");
    }

    if (!(await compare(passwd, user.passwd))) {
      throw new UnauthorizedErr("wrong password");
    }

    const accessToken = sign(
      {
        id: user._id,
        perms: user.role.perms.map((p) => p.code),
        is_active: user.active,
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
        expiresIn: 2592000, // 3600*24*30s
      }
    );

    res.json({
      user,
      accessToken,
      refreshToken,
    });

    await redis.set(`rf-tkn.${user._id}`, refreshToken, {
      EX: 2592001, // 1 + 3600*24*30s
    });
  } catch (e) {
    next(e);
  }
};
