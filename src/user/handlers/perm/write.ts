import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGroup } from "../../models/perm-group";
import { nats } from "../../nats";

export const writePerm: RequestHandler = async (req, res, next) => {
  const {
    code,
    info,
    perm_group_id,
  }: {
    code: string;
    info: string;
    perm_group_id: Types.ObjectId;
  } = req.body;

  try {
    const [dupl, group] = await Promise.all([
      Perm.exists({ code }),
      PermGroup.findById(perm_group_id),
    ]);

    if (dupl) {
      throw new ConflictErr("code already exist");
    }
    if (!group) {
      throw new BadReqErr("permission group not found");
    }

    const perm = new Perm({
      code,
      info,
      perm_group: group,
    });
    await perm.save();

    await Perm.populate(perm, {
      path: "perm_group",
      select: "-items",
    });

    res.status(201).json(perm);

    await Promise.allSettled([
      group.updateOne({
        $addToSet: {
          items: perm,
        },
      }),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Perm.modelName,
        action: "insert",
        doc: perm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
