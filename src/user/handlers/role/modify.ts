import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const modifyRole: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    perm_ids,
  }: {
    name?: string;
    level?: number;
    perm_ids?: Types.ObjectId[];
  } = req.body;

  try {
    if (name === undefined && level === undefined && perm_ids === undefined) {
      throw new BadReqErr("body not empty");
    }

    const permIds = Array.from(new Set(perm_ids));

    const [role, numPerms] = await Promise.all([
      Role.findById(req.params.id),
      Perm.countDocuments({
        _id: { $in: permIds },
      }),
    ]);
    if (!role) {
      throw new BadReqErr("role not found");
    }
    if (perm_ids && numPerms < permIds.length) {
      throw new BadReqErr("permission mismatch");
    }

    await role.updateOne({
      $set: perm_ids
        ? {
            name: name,
            level: level,
            perms: permIds,
          }
        : {
            name: name,
            level: level,
          },
    });

    const updItem = await Role.findById(req.params.id).populate({
      path: "perms",
      select: "-perm_group",
    });

    res.json(updItem);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "update",
      doc: await Role.populate(role, {
        path: "perms",
        select: "-perm_grp",
      }),
    });
  } catch (e) {
    next(e);
  }
};
