import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { UpdateUserPublisher } from "../../events/publisher/user/update";
import { User } from "../../models/user";

const modifyAccess: RequestHandler = async (req, res, next) => {
  const { status } = req.body;

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
        path: "perms",
        select: "-perm_group",
      },
    });
    if (!user) {
      throw new BadReqErr("User not found");
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
