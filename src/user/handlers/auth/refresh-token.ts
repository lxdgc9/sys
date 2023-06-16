import { RequestHandler } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { JwtPayload } from "@lxdgc9/pkg/dist/handlers";
import { User } from "../../models/user";

const refreshToken: RequestHandler = async (req, res, next) => {
  const { token }: { token: string } = req.body;

  try {
    const { id } = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as Secret
    ) as JwtPayload;

    const user = await User.findById(id)
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
      throw new UnauthorizedErr("Invalid token");
    }

    const access_token = jwt.sign(
      {
        id,
        rules: user.role.rules.map((p) => p.code),
        is_active: user.is_active,
      },
      process.env.ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: 900 }
    );
    const refresh_token = jwt.sign(
      { id },
      process.env.REFRESH_TOKEN_SECRET as Secret,
      { expiresIn: 36288000 }
    );

    res.json({
      access_token,
      refresh_token,
    });
  } catch (e) {
    next(e);
  }
};

export default refreshToken;
