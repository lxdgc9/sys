import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { DeleteManyUserPublisher } from "../../events/publisher/user/delete-many";
import { User } from "../../models/user";
import { nats } from "../../nats";

export const delItems: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = Array.from(new Set(req.body));

  try {
    const items = await User.find({
      _id: { $in: ids },
    });
    if (items.length < ids.length) {
      throw new BadReqErr("item mismatch");
    }

    await User.deleteMany({
      _id: { $in: ids },
    });

    res.json({ msg: "ok" });

    await Promise.all([
      new DeleteManyUserPublisher(nats.cli).publish(ids),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "delete",
        doc: await User.populate(items, {
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
