import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const updateItem: RequestHandler = async (req, res, next) => {
  const {
    name,
    perm_ids: permIds,
  }: {
    name?: string;
    perm_ids?: Types.ObjectId[];
  } = req.body;

  try {
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    const _permIds = Array.from(new Set(permIds));

    const [item, permCount] = await Promise.all([
      PermGrp.findById(req.params.id),
      Perm.countDocuments({
        _id: { $in: _permIds },
      }),
    ]);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (permIds && permCount < _permIds.length) {
      throw new BadReqErr("perm_ids mismatch");
    }

    await item.updateOne({
      $set: {
        name,
        perms: _permIds,
      },
    });

    res.json({
      group: await PermGrp.findById(item._id).populate({
        path: "perms",
        select: "-perm_grp",
      }),
    });

    await Promise.all([
      permIds &&
        (await Promise.all([
          Perm.deleteMany({
            _id: item.perms.filter((p) => !_permIds.includes(p)),
          }),
          Perm.updateMany(
            {
              _id: {
                $in: _permIds,
              },
            },
            {
              $set: {
                perm_grp: item._id,
              },
            }
          ),
        ])),
      new LogPublisher(nats.cli).publish({
        model: PermGrp.modelName,
        uid: req.user?.id,
        act: Actions.update,
        doc: item,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
