import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { JwtPayload } from "@lxdgc9/pkg/dist/middleware";
import { RequestHandler } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from "../model/user";
import { redis } from "../redis";

export const refreshToken: RequestHandler = async (req, res, next) => {
  const {
    token,
  }: {
    token: string;
  } = req.body;

  try {
    const { id } = verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    // Kiểm tra refreshToken có tồn tại trong cache hay không, nếu không
    // yêu cầu đăng nhập lại
    const storedTk = await redis.get(`rf-tkn.${id}`);
    if (storedTk !== token) {
      throw new UnauthorizedErr("require login, can't refresh token");
    }

    // Kiểm tra id đã được giải mã còn tồn tại trong db hay không
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
        select: "-group",
      },
    });
    if (!user) {
      throw new UnauthorizedErr("user not found");
    }

    // Tiến hành tạo lại accessToken và refreshToken
    const accessToken = sign(
      {
        id: user._id,
        perms: user.role.perms.map((p) => p.code),
        active: user.active,
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

    // Lưu refreshToken vào redis
    await redis.set(`rf-tkn.${id}`, refreshToken, {
      EX: 36288001, // 1 + 3600*24*60*7s
    });
  } catch (e) {
    next(e);
  }
};
