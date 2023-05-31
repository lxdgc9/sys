import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const updateRole: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    permIds,
  }: {
    name?: string;
    level?: number;
    permIds?: Types.ObjectId[];
  } = req.body;

  try {
    const [role, numPerms] = await Promise.all([
      Role.findById(req.params.id).populate({
        path: "perms",
        select: "-group",
      }),
      Perm.countDocuments({
        _id: {
          $in: permIds,
        },
      }),
    ]);
    if (!role) {
      throw new BadReqErr("role not found");
    }
    if (permIds && numPerms < permIds.length) {
      throw new BadReqErr("permIds mismatch");
    }

    const updRole = await Role.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          level,
          perms: permIds,
        },
      },
      { new: true }
    ).populate({
      path: "perms",
      select: "-group",
    });

    res.json({ role: updRole });

    await new LogPublisher(nats.cli).publish({
      userId: req.user?.id,
      model: Role.modelName,
      act: Actions.update,
      doc: role,
    });
  } catch (e) {
    next(e);
  }
};
