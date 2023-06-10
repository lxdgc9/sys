import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { LogPublisher } from "../../events/publisher/log";
import { PermGroup } from "../../models/perm-group";
import { nats } from "../../nats";

export const delPermGroup: RequestHandler = async (req, res, next) => {
  try {
    const group = await PermGroup.findById(req.params.id);
    if (!group) {
      throw new BadReqErr("permission group not found");
    }
    if (group.items.length > 0) {
      throw new BadReqErr("found dependent");
    }

    await group.deleteOne();

    res.sendStatus(204);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: PermGroup.modelName,
      action: "delete",
      doc: group,
    });
  } catch (e) {
    next(e);
  }
};
