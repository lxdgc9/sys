import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const updateItem: RequestHandler = async (req, res, next) => {
  const {
    code,
    desc,
    grp_id: grpId,
  }: {
    code?: string;
    desc?: string;
    grp_id?: Types.ObjectId;
  } = req.body;

  try {
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    const [item, dupl, exstGrp] = await Promise.all([
      Perm.findById(req.params.id),
      Perm.exists({
        _id: {
          $ne: req.params.id,
        },
        code,
      }),
      PermGrp.exists({ _id: grpId }),
    ]);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (code && dupl) {
      throw new ConflictErr("duplicate code");
    }
    if (grpId && !exstGrp) {
      throw new BadReqErr("group not found");
    }

    console.log(grpId);
    await item.updateOne({
      $set: {
        code,
        desc,
        perm_grp: grpId,
      },
    });

    const updItem = await Perm.findById(item._id).populate({
      path: "perm_grp",
      select: "-perms",
    });

    res.json({ perm: updItem });

    await Promise.all([
      grpId &&
        !item.perm_grp.equals(grpId) &&
        (await Promise.all([
          PermGrp.findByIdAndUpdate(grpId, {
            $addToSet: {
              perms: item._id,
            },
          }),
          PermGrp.findByIdAndUpdate(item.perm_grp, {
            $pull: {
              perms: item._id,
            },
          }),
        ])),
      new LogPublisher(nats.cli).publish({
        model: Perm.modelName,
        uid: req.user?.id,
        act: Actions.update,
        doc: await Perm.populate(item, {
          path: "perm_grp",
          select: "-perms",
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
