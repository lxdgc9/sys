import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
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

    const [existRole, numPerms] = await Promise.all([
      Role.exists({ _id: req.params.id }),
      Rule.countDocuments({
        _id: { $in: permIds },
      }),
    ]);
    if (!existRole) {
      throw new BadReqErr("Role not found");
    }
    if (perm_ids && numPerms < permIds.length) {
      throw new BadReqErr("Permission mismatch");
    }

    const updRole = await Role.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: perm_ids
          ? {
              name: name,
              level: level,
              rules: permIds,
            }
          : {
              name: name,
              level: level,
            },
      },
      { new: true }
    )
      .lean()
      .populate({
        path: "perms",
        select: "-perm_group",
      });
    res.json(updRole);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "update",
      data: updRole,
    });
  } catch (e) {
    next(e);
  }
};

export default modifyRole;
