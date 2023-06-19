import fs from "fs";
import { RequestHandler } from "express";
import { BadReqErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";

const uploadAvt: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadReqErr("Missing file");
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    const avtUrl = user.attrs.find((el) => el.k === "avatar");
    if (avtUrl) {
      fs.rmSync(avtUrl.v.replace("/api/users/", ""), { force: true });
      avtUrl.v = `/api/users/${req.file.path}`;
    } else {
      user.attrs.push({
        k: "avatar",
        v: `/api/users/${req.file.path}`,
      });
    }
    await user.updateOne({
      $set: { attrs: user.attrs },
    });

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

export default uploadAvt;
