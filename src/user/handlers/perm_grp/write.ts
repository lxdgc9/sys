import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const writeItem: RequestHandler = async (req, res, next) => {
  try {
    const nItem = new PermGrp(req.body);
    await nItem.save();

    res.status(201).json({ item: nItem });

    await new LogPublisher(nats.cli).publish({
      model: PermGrp.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: nItem,
    });
  } catch (e) {
    next(e);
  }
};
