import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const createManyPermGrp: RequestHandler = async (req, res, next) => {
  const permGrps: { name: string }[] = req.body;

  try {
    const newPermGrps = await PermGrp.insertMany(permGrps);

    res.status(201).json(newPermGrps);

    await new LogPublisher(nats.cli).publish({
      model: PermGrp.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: newPermGrps,
    });
  } catch (e) {
    next(e);
  }
};
