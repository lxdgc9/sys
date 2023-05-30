import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const insertPerm: RequestHandler = async (req, res, next) => {
  const {
    code,
    desc,
    groupId,
  }: {
    code: string;
    desc: string;
    groupId: Types.ObjectId;
  } = req.body;

  try {
    const [isDupl, group] = await Promise.all([
      Perm.exists({ code }),
      PermGr.findById(groupId),
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
      group: groupId,
    });
    await newPerm.save();

    const perm = await Perm.findById(newPerm._id).populate({
      path: "group",
      select: "-perms",
    });

    res.status(201).send({ perm });

    await Promise.all([
      group.updateOne({
        $addToSet: {
          perms: newPerm._id,
        },
      }),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Perm.modelName,
        act: Actions.insert,
        doc: perm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
