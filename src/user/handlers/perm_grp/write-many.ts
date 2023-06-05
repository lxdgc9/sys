import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const writeItems: RequestHandler = async (req, res, next) => {
  try {
    const newItems = await PermGrp.insertMany(req.body);

    res.status(201).json({ groups: newItems });

    await new LogPublisher(nats.cli).publish({
      model: PermGrp.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: newItems,
    });
  } catch (e) {
    next(e);
  }
};
