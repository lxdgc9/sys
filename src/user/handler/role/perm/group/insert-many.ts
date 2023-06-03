import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const insrtItems: RequestHandler = async (req, res, next) => {
  try {
    const newItems = await PermGr.insertMany(req.body);

    res.status(201).json({ groups: newItems });

    await new LogPublisher(nats.cli).publish({
      userId: req.user?.id,
      model: PermGr.modelName,
      act: Actions.insert,
      doc: newItems,
    });
  } catch (e) {
    next(e);
  }
};
