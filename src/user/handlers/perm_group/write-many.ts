import { RequestHandler } from "express";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { PermGroup } from "../../models/perm-group";

const writePermGroups: RequestHandler = async (req, res, next) => {
  const groups: { name: string }[] = req.body;

  try {
    const nGroups = await PermGroup.insertMany(groups);
    res.status(201).json(nGroups);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: PermGroup.modelName,
      action: "insert",
      data: nGroups,
    });
  } catch (e) {
    next(e);
  }
};

export default writePermGroups;
