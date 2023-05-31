import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const insertRoles: RequestHandler = async (req, res, next) => {
  const {
    roles,
  }: {
    roles: {
      name: string;
      level: number;
      permIds: Types.ObjectId[];
    }[];
  } = req.body;

  try {
    const set = new Set(roles.map((r) => r.permIds).flat());
    const numPerms = await Perm.countDocuments({
      _id: {
        $in: Array.from(set),
      },
    });
    if (numPerms < set.size) {
      throw new BadReqErr("permIds mismatch");
    }

    const _roles = await Role.insertMany(
      roles.map(({ name, level, permIds }) => ({
        name,
        level,
        perms: permIds,
      }))
    );
    const docs = await Role.find({
      _id: {
        $in: _roles.map((r) => r._id),
      },
    }).populate({
      path: "perms",
      select: "-group",
    });

    res.status(201).json({ roles: docs });

    await new LogPublisher(nats.cli).publish({
      userId: req.user?.id,
      model: Role.modelName,
      act: Actions.insert,
      doc: docs,
    });
  } catch (e) {
    next(e);
  }
};
