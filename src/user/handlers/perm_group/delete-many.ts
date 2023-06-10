import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { LogPublisher } from "../../events/publisher/log";
import { PermGroup } from "../../models/perm-group";
import { nats } from "../../nats";

export const delPermGroups: RequestHandler = async (req, res, next) => {
  const ids = [...new Set(req.body)] as Types.ObjectId[];

  try {
    const groups = await PermGroup.find({
      _id: { $in: ids },
    });

    if (groups.length < ids.length) {
      throw new BadReqErr("permission group mismatch");
    }
    if (groups.some((el) => el.items.length > 0)) {
      throw new BadReqErr("found dependent");
    }

    await PermGroup.deleteMany({
      _id: { $in: ids },
    });

    res.sendStatus(204);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: PermGroup.modelName,
      action: "delete",
      doc: groups,
    });
  } catch (e) {
    next(e);
  }
};
