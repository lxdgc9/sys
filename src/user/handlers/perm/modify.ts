import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGroup } from "../../models/perm-group";

const modifyPerm: RequestHandler = async (req, res, next) => {
  const {
    code,
    info,
    perm_group_id,
  }: {
    code?: string;
    info?: string;
    perm_group_id?: Types.ObjectId;
  } = req.body;

  try {
    if (
      code === undefined &&
      info === undefined &&
      perm_group_id === undefined
    ) {
      throw new BadReqErr("Missing fields");
    }

    const perm = await Perm.findById(req.params.id);
    if (!perm) {
      throw new BadReqErr("Permission not found");
    }

    const [dupl, existGroup] = await Promise.all([
      code &&
      Perm.exists({
        $and: [
          {
            _id: { $ne: perm._id },
          },
          { code },
        ],
      }),
      perm_group_id &&
      PermGroup.exists({
        _id: {
          $in: perm_group_id,
        },
      }),
    ]);
    if (code && dupl) {
      throw new ConflictErr("Code already exist");
    }
    if (perm_group_id && !existGroup) {
      throw new BadReqErr("Permission Group not found");
    }

    const modPerm = await Perm.findByIdAndUpdate(
      perm._id,
      {
        $set: {
          code,
          info,
          perm_group: perm_group_id,
        },
      },
      { new: true }
    ).populate({
      path: "perm_group",
      select: "-items",
    });

    res.json(modPerm);

    await Promise.allSettled([
      PermGroup.findByIdAndUpdate(perm.perm_group, {
        $pull: {
          items: perm._id,
        },
      }),
      PermGroup.findByIdAndUpdate(modPerm!.perm_group._id, {
        $addToSet: {
          items: perm._id,
        },
      }),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Perm.modelName,
        action: "update",
        doc: modPerm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default modifyPerm;
