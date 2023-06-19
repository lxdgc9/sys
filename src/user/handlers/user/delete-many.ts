import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { DeleteManyUserPublisher } from "../../events/publisher/user/delete-many";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

export const deleteUsers: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const users = await User.find({ _id: { $in: ids } })
      .lean()
      .populate({
        path: "role",
        populate: {
          path: "rules",
          select: "-catalog",
        },
      });
    if (users.length < ids.length) {
      throw new BadReqErr("User mismatch");
    }

    await User.deleteMany({ _id: { $in: ids } });
    res.json({ msg: "Xóa thành công" });

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

export default deleteUsers;
