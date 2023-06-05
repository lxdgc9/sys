import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await PermGrp.findById(req.params.id);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (item.perms.length) {
      throw new BadReqErr("found dependent");
    }

    await item.deleteOne();

    res.json({ msg: "ok" });

    await new LogPublisher(nats.cli).publish({
      model: PermGrp.modelName,
      uid: req.user?.id,
      act: Actions.delete,
      doc: item,
    });
  } catch (e) {
    next(e);
  }
};
