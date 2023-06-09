import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermSet } from "../../models/perm-set";
import { nats } from "../../nats";

export const writePermSets: RequestHandler = async (req, res, next) => {
  const permSets: { name: string }[] = req.body;

  try {
    const nPermSets = await PermSet.insertMany(permSets);

    res.status(201).json(nPermSets);

    await new LogPublisher(nats.cli).publish({
      model: PermSet.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: nPermSets,
    });
  } catch (e) {
    next(e);
  }
};
