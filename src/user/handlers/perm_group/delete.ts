import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { PermGroup } from "../../models/perm-group";

const delPermGroup: RequestHandler = async (req, res, next) => {
  try {
    const group = await PermGroup.findById(req.params.id);
    if (!group) {
      throw new BadReqErr("Permission Group not found");
    }
    if (group.items.length > 0) {
      throw new BadReqErr("Found dependent");
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

export default delPermGroup;
