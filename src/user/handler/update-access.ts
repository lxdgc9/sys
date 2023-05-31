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

    await user.updateOne({
      $set: {
        active: status,
      },
    });

    const updUser = await User.findById(user._id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });

    res.json({ user: updUser });

    await Promise.all([
      new UpdateUserPublisher(nats.cli).publish(updUser!),
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
