import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermSet } from "../../models/perm-set";
import { nats } from "../../nats";

export const writeItem: RequestHandler = async (req, res, next) => {
  const data: {
    code: string;
    desc: string;
    grp_id: Types.ObjectId;
  } = req.body;

  try {
    const [dupl, grp] = await Promise.all([
      Perm.exists({ code: data.code }),
      PermSet.findById(data.grp_id),
    ]);
    if (dupl) {
      throw new ConflictErr("duplicate code");
    }
    if (!grp) {
      throw new BadReqErr("group not found");
    }

    const nItem = new Perm(data);
    await nItem.save();

    res.status(201).send({
      item: await Perm.populate(nItem, {
        path: "perm_grp",
        select: "-perms",
      }),
    });

    await Promise.all([
      grp.updateOne({
        $addToSet: {
          items: nItem._id,
        },
      }),
      new LogPublisher(nats.cli).publish({
        model: Perm.modelName,
        uid: req.user?.id,
        act: Actions.insert,
        doc: nItem,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
