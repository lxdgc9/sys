import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGroup } from "../../models/perm-group";
import { nats } from "../../nats";

export const writePermGroups: RequestHandler = async (req, res, next) => {
  const groups: { name: string }[] = req.body;

  try {
    const nGroups = await PermGroup.insertMany(groups);

    res.status(201).json(nGroups);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: PermGroup.modelName,
      action: "insert",
      doc: nGroups,
    });
  } catch (e) {
    next(e);
  }
};
