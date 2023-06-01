import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { DeleteManyUserPublisher } from "../event/publisher/user/delete-many";
import { User } from "../model/user";
import { nats } from "../nats";

export const deleteUsers: RequestHandler = async (req, res, next) => {
  const {
    ids,
  }: {
    ids: Types.ObjectId[];
  } = req.body;

  try {
    // Loại bỏ phần tử trùng trong ids
    const idArr = Array.from(new Set(ids));

    const users = await User.find({
      _id: {
        $in: idArr,
      },
    }).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });
    if (users.length < idArr.length) {
      throw new BadReqErr("userIds mismatch");
    }

    await User.deleteMany({
      _id: {
        $in: idArr,
      },
    });

    res.json({ msg: "deleted" });

    await Promise.all([
      // Thông báo cho các service khác
      new DeleteManyUserPublisher(nats.cli).publish(idArr),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: User.modelName,
        act: Actions.delete,
        doc: users,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
