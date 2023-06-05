import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const writeItem: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    perm_ids: permIds,
  }: {
    name: string;
    level: number;
    perm_ids: Types.ObjectId[];
  } = req.body;

  const _permIds = Array.from(new Set(permIds));

  try {
    const permCount = await Perm.countDocuments({
      _id: { $in: _permIds },
    });
    if (permCount < _permIds.length) {
      throw new BadReqErr("permission mismatch");
    }

    const newItem = new Role({
      name,
      level,
      perms: _permIds,
    });
    await newItem.save();

    res.json({
      role: await Role.populate(newItem, {
        path: "perms",
        select: "-perm_grp",
      }),
    });

    await new LogPublisher(nats.cli).publish({
      model: Role.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: newItem,
    });
  } catch (e) {
    next(e);
  }
};
