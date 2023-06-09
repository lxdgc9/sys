import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGroup } from "../../models/perm-group";
import { nats } from "../../nats";

export const writePermGroup: RequestHandler = async (req, res, next) => {
  const { name }: { name: string } = req.body;

  try {
    const group = new PermGroup({ name });
    await group.save();

    res.status(201).json(group);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: PermGroup.modelName,
      action: "insert",
      doc: group,
    });
  } catch (e) {
    next(e);
  }
};
