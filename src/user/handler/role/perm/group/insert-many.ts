import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const insertGroups: RequestHandler = async (req, res, next) => {
  const {
    groups,
  }: {
    groups: {
      name: string;
    }[];
  } = req.body;

  try {
    const _groups = await PermGr.insertMany(groups);

    res.status(201).json({ groups: _groups });

    await new LogPublisher(nats.cli).publish({
      act: Actions.insert,
      model: PermGr.modelName,
      doc: _groups,
      userId: req.user?.id,
    });
  } catch (e) {
    next(e);
  }
};
