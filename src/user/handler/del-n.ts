import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { DeleteManyUserPublisher } from "../event/publisher/user/delete-many";
import { User } from "../model/user";
import { nats } from "../nats";

export const delUsers: RequestHandler = async (req, res, next) => {
  const {
    userIds,
  }: {
    userIds: Types.ObjectId[];
  } = req.body;
  try {
    const users = await User.find({
      _id: { $in: userIds },
    });
    if (users.length < userIds.length) {
      throw new BadReqErr("userIds mismatch");
    }

    await User.deleteMany({ _id: userIds });

    await Promise.all([
      new DeleteManyUserPublisher(nats.cli).publish(userIds),
      new LogPublisher(nats.cli).publish({
        act: Actions.delete,
        model: User.modelName,
        doc: users,
        userId: req.user?.id,
      }),
    ]);

    res.json({ msg: "deleted users" });
  } catch (e) {
    next(e);
  }
};
