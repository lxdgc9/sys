import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const updatePerm: RequestHandler = async (req, res, next) => {
  const {
    code,
    desc,
    groupId,
  }: {
    code?: string;
    desc?: string;
    groupId?: Types.ObjectId;
  } = req.body;
  try {
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    const perm = await Perm.findById(req.params.id).populate({
      path: "group",
      select: "-perms",
    });
    if (!perm) {
      throw new BadReqErr("permission not found");
    }

    const [isDupl, exGroup] = await Promise.all([
      Perm.exists({
        _id: {
          $ne: req.params.id,
        },
        code,
      }),
      PermGr.exists({ _id: groupId }),
    ]);
    if (code && isDupl) {
      throw new ConflictErr("code duplicated");
    }
    if (groupId && !exGroup) {
      throw new BadReqErr("group not found");
    }

    const updPerm = await Perm.findByIdAndUpdate(
      perm._id,
      {
        $set: {
          code,
          desc,
          group: groupId,
        },
      },
      { new: true }
    ).populate({
      path: "group",
      select: "-perms",
    });

    res.json({ perm: updPerm });

    await Promise.all([
      groupId &&
        !perm.group._id.equals(groupId) &&
        (await Promise.all([
          PermGr.findByIdAndUpdate(groupId, {
            $addToSet: {
              perms: perm._id,
            },
          }),
          PermGr.findByIdAndUpdate(perm.group._id, {
            $pull: {
              perms: perm._id,
            },
          }),
        ])),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Perm.modelName,
        act: Actions.update,
        doc: perm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
