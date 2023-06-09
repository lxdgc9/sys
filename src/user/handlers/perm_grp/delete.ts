import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermSet } from "../../models/perm-set";
import { nats } from "../../nats";

export const delPermGrp: RequestHandler = async (req, res, next) => {
  try {
    const permGrp = await PermSet.findById(req.params.id);
    if (!permGrp) {
      throw new BadReqErr("perm group not found");
    }
    if (permGrp.items.length) {
      throw new BadReqErr("found dependent");
    }

    await permGrp.deleteOne();

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
