import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermSet } from "../../models/perm-set";
import { nats } from "../../nats";

export const writePermSet: RequestHandler = async (req, res, next) => {
  const { name }: { name: string } = req.body;

  try {
    const nPermSet = new PermSet({ name });
    await nPermSet.save();

    res.status(201).json(nPermSet);

    await new LogPublisher(nats.cli).publish({
      model: PermSet.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: nPermSet,
    });
  } catch (e) {
    next(e);
  }
};
