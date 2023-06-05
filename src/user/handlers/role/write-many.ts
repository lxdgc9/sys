import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const writeItems: RequestHandler = async (req, res, next) => {
  const items: {
    name: string;
    level: number;
    perm_ids: Types.ObjectId[];
  }[] = req.body;

  const permIds = Array.from(new Set(items.map((el) => el.perm_ids).flat()));

  try {
    const permCount = await Perm.countDocuments({
      _id: { $in: permIds },
    });
    if (permCount < permIds.length) {
      throw new BadReqErr("permission mismatch");
    }

    const newItems = await Role.insertMany(
      items.map(({ name, level, perm_ids: permIds }) => ({
        name,
        level,
        perms: Array.from(new Set(permIds)),
      }))
    );

    res.status(201).json({
      roles: await Role.populate(newItems, {
        path: "perms",
        select: "-perm_grp",
      }),
    });

    await new LogPublisher(nats.cli).publish({
      model: Role.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: newItems,
    });
  } catch (e) {
    next(e);
  }
};
