import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const insertGroup: RequestHandler = async (req, res, next) => {
  const {
    name,
  }: {
    name: string;
  } = req.body;

  try {
    const group = new PermGr({ name });
    await group.save();

    res.status(201).json({ group });

    await new LogPublisher(nats.cli).publish({
      userId: req.user?.id,
      model: PermGr.modelName,
      act: Actions.insert,
      doc: group,
    });
  } catch (e) {
    next(e);
  }
};
