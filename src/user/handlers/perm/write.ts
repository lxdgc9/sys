import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGroup } from "../../models/perm-group";

const writePerm: RequestHandler = async (req, res, next) => {
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
      PermGroup.exists({ _id: perm_group_id }),
    ]);
    if (dupl) {
      throw new ConflictErr("Code already exist");
    }
    if (!group) {
      throw new BadReqErr("Permission Group not found");
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
      PermGroup.updateOne(
        { _id: perm_group_id },
        {
          $addToSet: {
            items: perm,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Perm.modelName,
        action: "insert",
        data: perm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writePerm;
