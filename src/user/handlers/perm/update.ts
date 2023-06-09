import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermSet } from "../../models/perm-set";
import { nats } from "../../nats";

export const updateItem: RequestHandler = async (req, res, next) => {
  const data: {
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
        code: data.code,
      }),
      PermSet.exists({ _id: data.grp_id }),
    ]);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (data.code && dupl) {
      throw new ConflictErr("duplicate code");
    }
    if (data.grp_id && !exstGrp) {
      throw new BadReqErr("group not found");
    }

    await item.updateOne({
      $set: {
        code: data.code,
        info: data.desc,
        perm_set: data.grp_id,
      },
    });

    const updItem = await Perm.findById(item._id).populate({
      path: "perm_grp",
      select: "-perms",
    });

    res.json({ perm: updItem });

    await Promise.all([
      data.grp_id &&
        !item.perm_set.equals(data.grp_id) &&
        (await Promise.all([
          PermSet.findByIdAndUpdate(data.grp_id, {
            $addToSet: {
              items: item._id,
            },
          }),
          PermSet.findByIdAndUpdate(item.perm_set, {
            $pull: {
              items: item._id,
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
