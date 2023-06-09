import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { PermGroup } from "../../models/perm-group";
import { nats } from "../../nats";

export const writePermSets: RequestHandler = async (req, res, next) => {
  const items: { name: string }[] = req.body;

  try {
    const groups = await PermGroup.insertMany(items);

    res.status(201).json(groups);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: PermGroup.modelName,
      action: "insert",
      doc: groups,
    });
  } catch (e) {
    next(e);
  }
};
