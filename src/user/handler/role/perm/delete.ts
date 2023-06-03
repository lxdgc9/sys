import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await Perm.findByIdAndDelete(req.params.id).populate(
      "group",
      "-perms"
    );
    if (!item) {
      throw new BadReqErr("item not found");
    }

    res.json({ msg: "ok" });

    await Promise.all([
      PermGr.findByIdAndUpdate(item.group._id, {
        $pull: {
          perms: item._id,
        },
      }),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Perm.modelName,
        act: Actions.delete,
        doc: item,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
