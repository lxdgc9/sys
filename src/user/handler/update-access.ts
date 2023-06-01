import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../event/publisher/log";
import { UpdateUserPublisher } from "../event/publisher/user/mod";
import { User } from "../model/user";
import { nats } from "../nats";

export const updateAccess: RequestHandler = async (req, res, next) => {
  const {
    status,
  }: {
    status: boolean;
  } = req.body;

  try {
    // Kiểm tra người dùng có tồn tại trong db hay không
    const user = await User.findById(req.params.id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });
    if (!user) {
      throw new BadReqErr("user not found");
    }

    // Tiến hành cập nhật trạng thái truy cập của người dùng
    await user.updateOne({
      $set: {
        active: status,
      },
    });

    // Fetch data đã cập nhật trả về client
    const updUser = await User.findById(user._id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });

    res.json({ user: updUser });

    await Promise.all([
      // Thông báo cập nhật người dùng cho các service khác
      new UpdateUserPublisher(nats.cli).publish(updUser!),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: User.modelName,
        act: Actions.update,
        doc: user,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
