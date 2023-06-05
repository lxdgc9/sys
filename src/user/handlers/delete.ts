import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../events/publisher/log";
import { DeleteUserPublisher } from "../events/publisher/user/delete";
import { User } from "../models/user";
import { nats } from "../nats";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await User.findByIdAndDelete(req.params.id);
    if (!item) {
      throw new BadReqErr("item not found");
    }

    res.json({ msg: "ok" });

    await Promise.all([
      new DeleteUserPublisher(nats.cli).publish(item._id),
      new LogPublisher(nats.cli).publish({
        model: User.modelName,
        uid: req.user?.id,
        act: Actions.delete,
        doc: await User.populate(item, {
          path: "role",
          populate: {
            path: "perms",
            select: "-group",
          },
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
