import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGrp } from "../../models/perm-gr";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    const [item, depend] = await Promise.all([
      Perm.findById(req.params.id),
      Role.exists({
        perms: { $in: req.params.id },
      }),
    ]);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (depend) {
      throw new BadReqErr("found dependent");
    }

    await item.deleteOne();

    res.json({ msg: "ok" });

    await Promise.all([
      PermGrp.findByIdAndUpdate(item.perm_grp._id, {
        $pull: {
          perms: item._id,
        },
      }),
      new LogPublisher(nats.cli).publish({
        model: Perm.modelName,
        uid: req.user?.id,
        act: Actions.delete,
        doc: await Perm.populate(item, {
          path: "perm_grp",
          select: "-perms",
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
