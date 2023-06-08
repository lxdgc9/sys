import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const delPermGrp: RequestHandler = async (req, res, next) => {
  try {
    const permGrp = await PermGrp.findById(req.params.id);
    if (!permGrp) {
      throw new BadReqErr("perm group not found");
    }
    if (permGrp.perms.length) {
      throw new BadReqErr("found dependent");
    }

    await permGrp.deleteOne();

    res.sendStatus(204);

    await new LogPublisher(nats.cli).publish({
      model: PermGrp.modelName,
      uid: req.user?.id,
      act: Actions.delete,
      doc: permGrp,
    });
  } catch (e) {
    next(e);
  }
};
