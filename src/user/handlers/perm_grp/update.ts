import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermSet } from "../../models/perm-set";
import { nats } from "../../nats";

export const updatePermGrp: RequestHandler = async (req, res, next) => {
  const permGrp: {
    name?: string;
    perm_ids?: Types.ObjectId[];
  } = req.body;

  try {
    if (!Object.keys(permGrp).length) {
      throw new BadReqErr("perm group not empty");
    }

    const permIds = Array.from(new Set(permGrp.perm_ids));

    const [_permGrp, permCount] = await Promise.all([
      PermSet.findById(req.params.id),
      Perm.countDocuments({
        _id: { $in: permIds },
      }),
    ]);
    if (!_permGrp) {
      throw new BadReqErr("perm group not found");
    }
    if (permGrp.perm_ids && permCount < permIds.length) {
      throw new BadReqErr("permission mismatch");
    }

    await _permGrp.updateOne({
      $set: {
        name: permGrp.name,
        items: permIds,
      },
    });

    res.json(
      await PermSet.findById(_permGrp._id).populate({
        path: "perms",
        select: "-perm_grp",
      })
    );

    await Promise.all([
      permGrp.perm_ids &&
        (await Promise.all([
          Perm.deleteMany({
            _id: _permGrp.items.filter((p) => !permIds.includes(p)),
          }),
          Perm.updateMany(
            {
              _id: { $in: permIds },
            },
            {
              $set: {
                perm_set: _permGrp._id,
              },
            }
          ),
        ])),
      new LogPublisher(nats.cli).publish({
        model: PermSet.modelName,
        uid: req.user?.id,
        act: Actions.update,
        doc: await PermSet.populate(_permGrp, {
          path: "perms",
          select: "-perm_grp",
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
