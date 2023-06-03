import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    if (
      await Perm.exists({
        group: { $in: req.params.id },
      })
    ) {
      throw new BadReqErr("found dependent");
    }
    const item = await PermGr.findByIdAndDelete(req.params.id);
    if (!item) {
      throw new BadReqErr("not found");
    }

    res.json({ msg: "ok" });

    await Promise.all([
      Perm.updateMany(
        {
          _id: { $in: item.perms },
        },
        {
          $unset: {
            group: 1,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: PermGr.modelName,
        act: Actions.delete,
        doc: item,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
