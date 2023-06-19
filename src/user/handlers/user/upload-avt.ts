import { RequestHandler } from "express";
import { User } from "../../models/user";
import { BadReqErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";

const uploadAvt: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadReqErr("No avatar");
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    const attr = user.attrs.find((el) => el.k === "avatar");
    if (!attr) {
      user.attrs.push({
        k: "avatar",
        v: `/api/users/${req.path}`,
      });
    } else {
      attr.v = `/api/users/${req.file.path}`;
    }
    user.save();

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

export default uploadAvt;
