import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { DeleteManyUserPublisher } from "../../events/publisher/user/delete-many";
import { User } from "../../models/user";

export const delUsers: RequestHandler = async (req, res, next) => {
  const ids = [...new Set(req.body)] as Types.ObjectId[];

  try {
    const users = await User.find({ _id: { $in: ids } })
      .lean()
      .populate({
        path: "role",
        populate: {
          path: "perms",
          select: "-perm_group",
        },
      });
    if (users.length < ids.length) {
      throw new BadReqErr("User mismatch");
    }

    await User.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);

    await Promise.all([
      new DeleteManyUserPublisher(nats.cli).publish(ids),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "delete",
        data: users,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default delUsers;
