import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGroup } from "../../models/perm-group";
import { Role } from "../../models/role";

const delPerms: RequestHandler = async (req, res, next) => {
  const ids = [...new Set(req.body)] as Types.ObjectId[];

  try {
    const [perms, depend] = await Promise.all([
      Perm.find({
        _id: { $in: ids },
      }),
      Role.exists({
        perms: { $in: ids },
      }),
    ]);
    if (perms.length < ids.length) {
      throw new BadReqErr("Permission mismatch");
    }
    if (depend) {
      throw new BadReqErr("Found depedent");
    }

    await Perm.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);

    await Perm.populate(perms, {
      path: "perm_group",
      select: "-items",
    });

    await Promise.allSettled([
      PermGroup.updateMany(
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
        user_id: req.user?.id,
        model: Perm.modelName,
        action: "delete",
        doc: perms,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default delPerms;
