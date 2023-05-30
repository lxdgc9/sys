import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../../event/publisher/log";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const updateGroup: RequestHandler = async (req, res, next) => {
  const {
    name,
    permIds,
  }: {
    name?: string;
    permIds?: Types.ObjectId[];
  } = req.body;

  try {
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    const [group, numGroups] = await Promise.all([
      PermGr.findById(req.params.id),
      Perm.countDocuments({
        _id: {
          $in: permIds,
        },
      }),
    ]);
    if (!group) {
      throw new BadReqErr("group not found");
    }
    if (permIds && numGroups < permIds.length) {
      throw new BadReqErr("permIds mismatch");
    }

    const updGroup = await PermGr.findByIdAndUpdate(
      group._id,
      {
        $set: {
          name,
          perms: permIds,
        },
      },
      { new: true }
    ).populate({
      path: "perms",
      select: "-group",
    });

    res.json({ group: updGroup });

    await Promise.all([
      permIds &&
        Perm.deleteMany({
          _id: group.perms.filter((p) => !permIds.includes(p)),
        }),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: PermGr.modelName,
        act: Actions.update,
        doc: group,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
