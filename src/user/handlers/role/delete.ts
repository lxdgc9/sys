import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { LogPublisher } from "../../events/publisher/log";
import { Role } from "../../models/role";
import { User } from "../../models/user";
import { nats } from "../../nats";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    const [item, depend] = await Promise.all([
      Role.findById(req.params.id),
      User.exists({ role: req.params.id }),
    ]);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (depend) {
      throw new BadReqErr("found dependent");
    }

    await item.deleteOne();

    res.json({ msg: "ok" });

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "delete",
      doc: await Role.populate(item, {
        path: "perms",
        select: "-perm_grp",
      }),
    });
  } catch (e) {
    next(e);
  }
};
