import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { PermGroup } from "../../models/perm-group";

const modifyPermGroup: RequestHandler = async (req, res, next) => {
  const { name }: { name: string } = req.body;

  try {
    if (name === undefined) {
      throw new BadReqErr("Missing fields");
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
      throw new BadReqErr("Permision Group not found");
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

export default modifyPermGroup;
