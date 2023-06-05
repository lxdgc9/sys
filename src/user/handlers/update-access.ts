import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../events/publisher/log";
import { UpdateUserPublisher } from "../events/publisher/user/mod";
import { User } from "../models/user";
import { nats } from "../nats";

export const changeAccess: RequestHandler = async (req, res, next) => {
  const status: boolean = req.body;

  try {
    const item = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        active: status,
      },
    }).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-perm_grp",
      },
    });
    if (!item) {
      throw new BadReqErr("item not found");
    }

    await item.updateOne({
      $set: {
        active: status,
      },
    });

    const updItem = await User.findById(item._id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-perm_grp",
      },
    });

    res.json({ user: updItem });

    await Promise.all([
      new UpdateUserPublisher(nats.cli).publish(updItem!),
      new LogPublisher(nats.cli).publish({
        model: User.modelName,
        uid: req.user?.id,
        act: Actions.update,
        doc: item,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
