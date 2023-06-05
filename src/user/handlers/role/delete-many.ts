import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Role } from "../../models/role";
import { User } from "../../models/user";
import { nats } from "../../nats";

export const delItems: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = Array.from(new Set(req.body));

  try {
    const [items, depend] = await Promise.all([
      Role.find({
        _id: { $in: ids },
      }),
      User.exists({
        role: { $in: ids },
      }),
    ]);
    if (items.length < ids.length) {
      throw new BadReqErr("item mismatch");
    }
    if (depend) {
      throw new BadReqErr("found dependent");
    }

    await Role.deleteMany({
      _id: { $in: ids },
    });

    res.json({ msg: "ok" });

    await new LogPublisher(nats.cli).publish({
      model: Role.modelName,
      uid: req.user?.id,
      act: Actions.delete,
      doc: await Role.populate(items, {
        path: "perms",
        select: "-perm_grp",
      }),
    });
  } catch (e) {
    next(e);
  }
};
