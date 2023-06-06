import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const writeItem: RequestHandler = async (req, res, next) => {
  const data: {
    name: string;
    level: number;
    perm_ids: Types.ObjectId[];
  } = req.body;

  const pids = Array.from(new Set(data.perm_ids));

  try {
    const permCount = await Perm.countDocuments({
      _id: { $in: pids },
    });
    if (permCount < pids.length) {
      throw new BadReqErr("perm_ids mismatch");
    }

    const nItem = new Role({
      name: data.name,
      level: data.level,
      perms: pids,
    });
    await nItem.save();

    res.json({
      item: await Role.populate(nItem, {
        path: "perms",
        select: "-perm_grp",
      }),
    });

    await new LogPublisher(nats.cli).publish({
      model: Role.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: nItem,
    });
  } catch (e) {
    next(e);
  }
};
