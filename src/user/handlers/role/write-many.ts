import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const writeItems: RequestHandler = async (req, res, next) => {
  const data: {
    name: string;
    level: number;
    perm_ids: Types.ObjectId[];
  }[] = req.body;

  const pids = Array.from(new Set(data.map((el) => el.perm_ids).flat()));

  try {
    const permCount = await Perm.countDocuments({
      _id: { $in: pids },
    });
    if (permCount < pids.length) {
      throw new BadReqErr("perm_ids mismatch");
    }

    const nItems = await Role.insertMany(
      data.map(({ name, level, perm_ids }) => ({
        name,
        level,
        perms: Array.from(new Set(perm_ids)),
      }))
    );

    res.status(201).json({
      items: await Role.populate(nItems, {
        path: "perms",
        select: "-perm_grp",
      }),
    });

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "insert",
      doc: nItems,
    });
  } catch (e) {
    next(e);
  }
};
