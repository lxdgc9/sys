import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";
import { Role } from "../../models/role";

const delPerms: RequestHandler = async (req, res, next) => {
  const ids = [...new Set(req.body)] as Types.ObjectId[];

  try {
    const [perms, depend] = await Promise.all([
      Rule.find({ _id: { $in: ids } }).lean(),
      Role.exists({ rules: { $in: ids } }),
    ]);
    if (perms.length < ids.length) {
      throw new BadReqErr("Permission mismatch");
    }
    if (depend) {
      throw new BadReqErr("Found depedent");
    }

    await Rule.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);

    await Rule.populate(perms, {
      path: "perm_group",
      select: "-items",
    });

    await Promise.allSettled([
      Catalog.updateMany(
        {
          rules: { $in: ids },
        },
        {
          $pullAll: {
            rules: ids,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Rule.modelName,
        action: "delete",
        data: perms,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default delPerms;
