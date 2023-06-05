import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const writeItem: RequestHandler = async (req, res, next) => {
  try {
    const newItem = new PermGrp(req.body);
    await newItem.save();

    res.status(201).json({ group: newItem });

    await new LogPublisher(nats.cli).publish({
      model: PermGrp.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: newItem,
    });
  } catch (e) {
    next(e);
  }
};
