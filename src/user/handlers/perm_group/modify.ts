import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { LogPublisher } from "../../events/publisher/log";
import { PermGroup } from "../../models/perm-group";
import { nats } from "../../nats";

export const modifyPermSet: RequestHandler = async (req, res, next) => {
  const {
    name,
  }: {
    name?: string;
  } = req.body;

  try {
    if (!name) {
      throw new BadReqErr("missing fields");
    }

    const group = await PermGroup.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
        },
      },
      { new: true }
    );
    if (!group) {
      throw new BadReqErr("permission group not found");
    }

    res.json(group);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: PermGroup.modelName,
      action: "update",
      doc: group,
    });
  } catch (e) {
    next(e);
  }
};
