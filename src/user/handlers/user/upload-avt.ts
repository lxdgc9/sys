import fs from "fs";
import { RequestHandler } from "express";
import { BadReqErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { UpdateUserPublisher } from "../../events/publisher/user/update";
import nats from "../../nats";

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

    const _user = await User.findById(user._id).populate<{
      role: {
        name: string;
      };
    }>([
      {
        path: "role",
        populate: {
          path: "rules",
          select: "-catalog",
        },
      },
      {
        path: "spec_rules",
        select: "-catalog",
      },
    ]);
    console.log("debug:", _user);
    await new UpdateUserPublisher(nats.cli).publish({
      id: _user!._id,
      attrs: _user!.attrs,
      is_active: _user!.is_active,
      role: _user!.role.name,
    });
  } catch (e) {
    next(e);
    if (req.file) {
      fs.rmSync(req.file.path, { force: true });
    }
  }
};

export default uploadAvt;
