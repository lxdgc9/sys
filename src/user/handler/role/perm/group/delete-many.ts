import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../../event/publisher/log";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const deleteGroups: RequestHandler = async (req, res, next) => {
  const {
    ids,
  }: {
    ids: Types.ObjectId[];
  } = req.body;

  try {
    const groups = await PermGr.find({
      _id: {
        $in: ids,
      },
    });
    if (groups.length < ids.length) {
      throw new BadReqErr("ids mismatch");
    }

    await PermGr.deleteMany({
      _id: {
        $in: ids,
      },
    });

    res.json({ msg: "deleted" });

    await Promise.all([
      // Xóa permission có group thuộc ids
      Perm.deleteMany({
        group: {
          $in: ids,
        },
      }),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: PermGr.modelName,
        act: Actions.delete,
        doc: groups,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
