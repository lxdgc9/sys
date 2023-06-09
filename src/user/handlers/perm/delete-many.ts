import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermSet } from "../../models/perm-set";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const delItems: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = Array.from(new Set(req.body));

  try {
    const [items, depend] = await Promise.all([
      Perm.find({
        _id: { $in: ids },
      }),
      Role.exists({
        permissions: { $in: ids },
      }),
    ]);
    if (items.length < ids.length) {
      throw new BadReqErr("items mismatch");
    }
    if (depend) {
      throw new BadReqErr("found dependent");
    }

    await Perm.deleteMany({
      _id: { $in: ids },
    });

    res.json({ msg: "ok" });

    await Promise.all([
      PermSet.updateMany(
        {
          items: { $in: ids },
        },
        {
          $pullAll: {
            items: ids,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        model: Perm.modelName,
        uid: req.user?.id,
        act: Actions.delete,
        doc: await Perm.populate(items, {
          path: "perm_grp",
          select: "-perms",
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
