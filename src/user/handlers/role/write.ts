import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const writeRole: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    perm_ids,
  }: {
    name: string;
    level: number;
    perm_ids: Types.ObjectId[];
  } = req.body;

  const permIds = Array.from(new Set(perm_ids));

  try {
    const numPerms = await Perm.countDocuments({
      _id: { $in: permIds },
    });
    if (numPerms < permIds.length) {
      throw new BadReqErr("perm_ids mismatch");
    }

    const nRole = new Role({
      name: name,
      level: level,
      perms: permIds,
    });
    await nRole.save();

    await Role.populate(nRole, {
      path: "perms",
      select: "-perm_group",
    });

    res.json(nRole);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "insert",
      doc: nRole,
    });
  } catch (e) {
    next(e);
  }
};
