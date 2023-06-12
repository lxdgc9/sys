import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { Role } from "../../models/role";

const modifyRole: RequestHandler = async (req, res, next) => {
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
      throw new BadReqErr("Missing fields");
    }

    const permIds = [...new Set(perm_ids)];

    const [role, numPerms] = await Promise.all([
      Role.findById(req.params.id),
      Perm.countDocuments({
        _id: { $in: permIds },
      }),
    ]);
    if (!role) {
      throw new BadReqErr("Role not found");
    }
    if (perm_ids && numPerms < permIds.length) {
      throw new BadReqErr("Permission mismatch");
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

    const updRole = await Role.findById(req.params.id).populate({
      path: "perms",
      select: "-perm_group",
    });

    res.json(updRole);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "update",
      doc: updRole,
    });
  } catch (e) {
    next(e);
  }
};

export default modifyRole;
