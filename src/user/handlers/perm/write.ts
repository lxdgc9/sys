import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const writeItem: RequestHandler = async (req, res, next) => {
  const {
    code,
    desc,
    grp_id: grpId,
  }: {
    code: string;
    desc: string;
    grp_id: Types.ObjectId;
  } = req.body;

  try {
    const [isDupl, item] = await Promise.all([
      Perm.exists({ code }),
      PermGrp.findById(grpId),
    ]);
    if (isDupl) {
      throw new ConflictErr("duplicate code");
    }
    if (!item) {
      throw new BadReqErr("group not found");
    }

    const newItem = new Perm({
      code,
      desc,
      perm_grp: grpId,
    });
    await newItem.save();

    res.status(201).send({
      perm: await Perm.populate(newItem, {
        path: "perm_grp",
        select: "-perms",
      }),
    });

    await Promise.all([
      item.updateOne({
        $addToSet: {
          perms: newItem._id,
        },
      }),
      new LogPublisher(nats.cli).publish({
        model: Perm.modelName,
        uid: req.user?.id,
        act: Actions.insert,
        doc: newItem,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
