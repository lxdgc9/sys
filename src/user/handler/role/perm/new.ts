import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const newPerm: RequestHandler = async (req, res, next) => {
  const {
    code: code,
    description: desc,
    groupId: grpId,
  }: {
    code: string;
    description: string;
    groupId: Types.ObjectId;
  } = req.body;
  try {
    const [isDupl, group] = await Promise.all([
      Perm.exists({ code }),
      PermGr.findById(grpId),
    ]);
    if (isDupl) {
      throw new ConflictErr("duplicate code");
    }
    if (!group) {
      throw new BadReqErr("group not found");
    }

    const newPerm = new Perm({
      code,
      desc,
      group: grpId,
    });
    await Promise.all([
      newPerm.save(),
      group.updateOne({
        $addToSet: {
          perms: newPerm._id,
        },
      }),
    ]);

    const perm = await Perm.findById(newPerm._id).populate({
      path: "group",
      select: "-perms",
    });

    res.status(201).send({
      permission: perm,
    });

    await new LogPublisher(nats.cli).publish({
      act: "NEW",
      model: Perm.modelName,
      doc: perm!,
      userId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
