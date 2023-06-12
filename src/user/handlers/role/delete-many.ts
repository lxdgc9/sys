import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Role } from "../../models/role";
import { User } from "../../models/user";

const delRoles: RequestHandler = async (req, res, next) => {
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
      throw new BadReqErr("Roles mismatch");
    }
    if (depend) {
      throw new BadReqErr("Found dependent");
    }

    await Role.deleteMany({
      _id: { $in: ids },
    });

    res.sendStatus(204);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "delete",
      doc: await Role.populate(items, {
        path: "perms",
        select: "-perm_grp",
      }),
    });
  } catch (e) {
    next(e);
  }
};

export default delRoles;
