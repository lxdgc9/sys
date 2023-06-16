import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
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
    })
      .lean()
      .populate<{
        role: {
          rules: {
            code: string;
          }[];
        };
      }>({
        path: "role",
        populate: {
          path: "rules",
          select: "-catalog",
        },
      });
    if (!user) {
      throw new UnauthorizedErr("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedErr("Wrong password");
    }

    const access_token = jwt.sign(
      {
        id: user._id,
        rules: user.role.rules.map((p) => p.code),
        is_active: user.is_active,
      },
      process.env.ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: 900 }
    );
    const refresh_token = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET as Secret,
      { expiresIn: 2592000 }
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
