import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const createPermGrp: RequestHandler = async (req, res, next) => {
  const { name }: { name: string } = req.body;

  try {
    const newPermGrp = new PermGrp({ name });
    await newPermGrp.save();

    res.status(201).json(newPermGrp);

    await new LogPublisher(nats.cli).publish({
      model: PermGrp.modelName,
      uid: req.user?.id,
      act: Actions.insert,
      doc: newPermGrp,
    });
  } catch (e) {
    next(e);
  }
};
