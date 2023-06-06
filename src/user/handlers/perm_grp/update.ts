import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const updateItem: RequestHandler = async (req, res, next) => {
  const data: {
    name?: string;
    perm_ids?: Types.ObjectId[];
  } = req.body;

  try {
    if (!Object.keys(data).length) {
      throw new BadReqErr("data not empty");
    }

    const pids = Array.from(new Set(data.perm_ids));

    const [item, permCount] = await Promise.all([
      PermGrp.findById(req.params.id),
      Perm.countDocuments({
        _id: { $in: pids },
      }),
    ]);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (data.perm_ids && permCount < pids.length) {
      throw new BadReqErr("permission mismatch");
    }

    await item.updateOne({
      $set: {
        name: data.name,
        perms: pids,
      },
    });

    res.json({
      group: await PermGrp.findById(item._id).populate({
        path: "perms",
        select: "-perm_grp",
      }),
    });

    await Promise.all([
      data.perm_ids &&
        (await Promise.all([
          Perm.deleteMany({
            _id: item.perms.filter((p) => !pids.includes(p)),
          }),
          Perm.updateMany(
            {
              _id: { $in: pids },
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
        doc: await PermGrp.populate(item, {
          path: "perms",
          select: "-perm_grp",
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
