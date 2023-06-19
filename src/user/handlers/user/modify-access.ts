import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { UpdateUserPublisher } from "../../events/publisher/user/update";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const modifyAccess: RequestHandler = async (req, res, next) => {
  const { status }: { status: boolean } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          is_active: status,
        },
      },
      { new: true }
    ).populate({
      path: "role",
      populate: {
        path: "rules",
        select: "-catalog",
      },
    });
    if (!user) {
      throw new BadReqErr("Không tìm thấy người dùng");
    }
    res.json(user);

    await Promise.allSettled([
      new UpdateUserPublisher(nats.cli).publish(user),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "update",
        data: user,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default modifyAccess;
