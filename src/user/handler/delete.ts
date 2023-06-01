import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../event/publisher/log";
import { DeleteUserPublisher } from "../event/publisher/user/del";
import { User } from "../model/user";
import { nats } from "../nats";

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });
    if (!user) {
      throw new BadReqErr("user not found");
    }

    res.json({ msg: "deleted" });

    await Promise.all([
      // Thông báo sự kiện xóa user để các service khác cập nhật tình hình
      new DeleteUserPublisher(nats.cli).publish(user._id),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: User.modelName,
        act: Actions.delete,
        doc: user,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
