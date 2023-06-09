import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGroup } from "../../models/perm-group";
import { Role } from "../../models/role";
import { nats } from "../../nats";

export const delPerms: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = Array.from(new Set(req.body));

  try {
    const [perms, depend] = await Promise.all([
      Perm.find({
        _id: {
          $in: ids,
        },
      }),
      Role.exists({
        perms: {
          $in: ids,
        },
      }),
    ]);
    if (perms.length < ids.length) {
      throw new BadReqErr("permissions mismatch");
    }
    if (depend) {
      throw new BadReqErr("found depedent");
    }

    await Perm.deleteMany({
      _id: { $in: ids },
    });

    res.sendStatus(204);

    await Promise.allSettled([
      PermGroup.updateMany(
        {
          items: {
            $in: ids,
          },
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
        doc: await Perm.populate(perms, {
          path: "perm_set",
          select: "-items",
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
