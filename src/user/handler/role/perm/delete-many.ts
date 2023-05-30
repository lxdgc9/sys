import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const deleteManyPerm: RequestHandler = async (req, res, next) => {
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
    });
    if (perms.length < ids.length) {
      throw new BadReqErr("ids mismatch");
    }

    await Perm.deleteMany({
      _id: {
        $in: ids,
      },
    });

    res.json({ msg: "delete groups" });

    await Promise.all([
      PermGr.updateMany(
        {
          _id: {
            $in: perms.map((p) => p.group),
          },
        },
        {
          $pullAll: {
            perms: ids,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        act: "DEL",
        model: Perm.modelName,
        doc: perms,
        userId: req.user?.id,
        status: true,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
