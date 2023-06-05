import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const updateItem: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    perm_ids: permIds,
  }: {
    name?: string;
    level?: number;
    perm_ids?: Types.ObjectId[];
  } = req.body;

  try {
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    const _permIds = Array.from(new Set(permIds));

    const [item, permCount] = await Promise.all([
      Role.findById(req.params.id),
      Perm.countDocuments({
        _id: { $in: _permIds },
      }),
    ]);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (permIds && permCount < _permIds.length) {
      throw new BadReqErr("permission mismatch");
    }

    await item.updateOne({
      $set: permIds
        ? {
            name,
            level,
            perms: _permIds,
          }
        : {
            name,
            level,
          },
    });

    res.json({
      role: await Role.findById(req.params.id).populate({
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
