import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";

const login: RequestHandler = async (req, res, next) => {
  const {
    k,
    v,
    password,
  }: {
    k: string;
    v: string;
    password: string;
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
        select: "-perm_group",
      },
    });
    if (!user) {
      throw new UnauthorizedErr("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedErr("Wrong password");
    }

    const access_token = jwt.sign(
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
    const refresh_token = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: 2592000, // 3600*24*30s
      }
    );

    res.json({
      user,
      access_token,
      refresh_token,
    });
  } catch (e) {
    next(e);
  }
};

export default login;
