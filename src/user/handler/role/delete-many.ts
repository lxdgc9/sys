import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const deleteRoles: RequestHandler = async (req, res, next) => {
  const {
    ids,
  }: {
    ids: Types.ObjectId[];
  } = req.body;

  try {
    const roles = await Role.find({
      _id: {
        $in: ids,
      },
    }).populate({
      path: "perms",
      select: "-group",
    });
    if (roles.length < ids.length) {
      throw new BadReqErr("ids mismatch");
    }

    await Role.deleteMany({
      _id: {
        $in: ids,
      },
    });

    res.json({ msg: "deleted" });

    await Promise.all([
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Role.modelName,
        act: Actions.delete,
        doc: roles,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
