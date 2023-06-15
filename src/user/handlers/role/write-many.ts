import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Role } from "../../models/role";

const writePerms: RequestHandler = async (req, res, next) => {
  const perms: {
    name: string;
    level: number;
    perm_ids: Types.ObjectId[];
  }[] = req.body;

  const permIds = [...new Set(perms.map((p) => p.perm_ids).flat())];

  try {
    const numPerms = await Rule.countDocuments({
      _id: { $in: permIds },
    });
    if (numPerms < permIds.length) {
      throw new BadReqErr("Permission mismatch");
    }

    const nRoles = await Role.insertMany(
      perms.map((item) => ({
        name: item.name,
        level: item.level,
        perms: [...new Set(item.perm_ids)],
      }))
    );

    await Role.populate(nRoles, {
      path: "perms",
      select: "-perm_group",
    });
    res.json(nRoles);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "insert",
      data: nRoles,
    });
  } catch (e) {
    next(e);
  }
};

export default writePerms;
