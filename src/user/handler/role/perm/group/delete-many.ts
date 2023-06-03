import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../../event/publisher/log";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const delItems: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const uids = Array.from(new Set(ids));

    const items = await PermGr.find({
      _id: { $in: uids },
    });
    if (items.length < uids.length) {
      throw new BadReqErr("mismatch");
    }

    await PermGr.deleteMany({
      _id: { $in: uids },
    });

    res.json({ msg: "ok" });

    await Promise.all([
      Perm.updateMany(
        {
          group: { $in: uids },
        },
        {
          $pullAll: {
            perms: uids,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Perm.modelName,
        act: Actions.delete,
        doc: items,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
