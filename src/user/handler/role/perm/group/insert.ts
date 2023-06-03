import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const insrtItem: RequestHandler = async (req, res, next) => {
  try {
    const newItem = new PermGr(req.body);
    await newItem.save();

    res.status(201).json({ group: newItem });

    await new LogPublisher(nats.cli).publish({
      userId: req.user?.id,
      model: PermGr.modelName,
      act: Actions.insert,
      doc: newItem,
    });
  } catch (e) {
    next(e);
  }
};
