import { BadReqErr } from "@lxdgc9/pkg/dist/err";
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
        user_id: req.user?.id,
        model: User.modelName,
        action: "delete",
        doc: await User.populate(item, {
          path: "role",
          populate: {
            path: "perms",
            select: "-perm_grp",
          },
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
