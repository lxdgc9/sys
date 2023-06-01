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

    // Thông báo đến log service
    await new LogPublisher(nats.cli).publish({
      userId: req.user?.id,
      model: PermGr.modelName,
      act: Actions.insert,
      doc: _groups,
    });
  } catch (e) {
    next(e);
  }
};
