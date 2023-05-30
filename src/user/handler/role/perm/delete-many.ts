import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const deletePerms: RequestHandler = async (req, res, next) => {
  const {
    ids,
  }: {
    ids: Types.ObjectId[];
  } = req.body;

  try {
    const perms = await Perm.find({
      _id: {
        $in: ids,
      },
    }).populate({
      path: "group",
      select: "-perms",
    });
    if (perms.length < ids.length) {
      throw new BadReqErr("ids mismatch");
    }

    await Perm.deleteMany({
      _id: {
        $in: ids,
      },
    });

    res.json({ msg: "deleted" });

    await Promise.all([
      PermGr.updateMany(
        {
          _id: {
            $in: perms.map((p) => p.group._id),
          },
        },
        {
          $pullAll: {
            perms: ids,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Perm.modelName,
        act: Actions.delete,
        doc: perms,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
