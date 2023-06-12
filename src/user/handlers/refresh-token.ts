import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { JwtPayload } from "@lxdgc9/pkg/dist/handlers";
import { User } from "../models/user";

const refreshToken: RequestHandler = async (req, res, next) => {
  const { token }: { token: string } = req.body;

  try {
    const { id } = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

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
        select: "-perm_group",
      },
    });
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        perms: user.role.perms.map((p) => p.code),
        is_active: user.is_active,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 900, // 15*60s
      }
    );
    const refreshToken = jwt.sign(
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
  } catch (e) {
    next(e);
  }
};

export default refreshToken;
