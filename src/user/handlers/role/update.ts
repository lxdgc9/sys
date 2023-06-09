import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const updateItem: RequestHandler = async (req, res, next) => {
  const data: {
    name?: string;
    level?: number;
    perm_ids?: Types.ObjectId[];
  } = req.body;

  try {
    if (!Object.keys(data).length) {
      throw new BadReqErr("body not empty");
    }

    const pids = Array.from(new Set(data.perm_ids));

    const [item, permCount] = await Promise.all([
      Role.findById(req.params.id),
      Perm.countDocuments({
        _id: { $in: pids },
      }),
    ]);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (data.perm_ids && permCount < pids.length) {
      throw new BadReqErr("permission mismatch");
    }

    await item.updateOne({
      $set: data.perm_ids
        ? {
            name: data.name,
            level: data.level,
            permissions: pids,
          }
        : {
            name: data.name,
            level: data.level,
          },
    });

    res.json({
      item: await Role.findById(req.params.id).populate({
        path: "perms",
        select: "-perm_grp",
      }),
    });

    await new LogPublisher(nats.cli).publish({
      model: Role.modelName,
      uid: req.user?.id,
      act: Actions.update,
      doc: await Role.populate(item, {
        path: "perms",
        select: "-perm_grp",
      }),
    });
  } catch (e) {
    next(e);
  }
};
