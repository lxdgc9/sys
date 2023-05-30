import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../../event/publisher/log";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const deleteManyGroup: RequestHandler = async (req, res, next) => {
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

    await Promise.all([
      PermGr.deleteMany({
        _id: {
          $in: ids,
        },
      }),
      Perm.deleteMany({
        group: {
          $in: ids,
        },
      }),
      new LogPublisher(nats.cli).publish({
        act: "DEL",
        model: PermGr.modelName,
        doc: groups,
        userId: req.user?.id,
        status: true,
      }),
    ]);

    res.json({ msg: "group deleted" });
  } catch (e) {
    next(e);
  }
};
