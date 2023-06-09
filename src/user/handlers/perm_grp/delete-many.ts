import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { PermSet } from "../../models/perm-set";
import { nats } from "../../nats";

export const delManyPermGrp: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = Array.from(new Set(req.body));

  try {
    const permGrp = await PermSet.find({
      _id: { $in: ids },
    });
    if (permGrp.length < ids.length) {
      throw new BadReqErr("ids mismatch");
    }
    if (permGrp.some((el) => el.items.length)) {
      throw new BadReqErr("found dependent");
    }

    await PermSet.deleteMany({
      _id: { $in: ids },
    });

    res.sendStatus(204);

    await new LogPublisher(nats.cli).publish({
      model: PermSet.modelName,
      uid: req.user?.id,
      act: Actions.delete,
      doc: permGrp,
    });
  } catch (e) {
    next(e);
  }
};
