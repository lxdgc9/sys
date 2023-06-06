import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const delItems: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = Array.from(new Set(req.body));

  try {
    const items = await PermGrp.find({
      _id: { $in: ids },
    });
    if (items.length < ids.length) {
      throw new BadReqErr("items mismatch");
    }
    if (items.some((el) => el.perms.length)) {
      throw new BadReqErr("found dependent");
    }

    await PermGrp.deleteMany({
      _id: { $in: ids },
    });

    res.json({ msg: "ok" });

    await new LogPublisher(nats.cli).publish({
      model: PermGrp.modelName,
      uid: req.user?.id,
      act: Actions.delete,
      doc: items,
    });
  } catch (e) {
    next(e);
  }
};
