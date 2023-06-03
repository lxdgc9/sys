import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../../event/publisher/log";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

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

    const uPermIds = Array.from(new Set(permIds));

    const [item, permCount] = await Promise.all([
      PermGr.findById(req.params.id),
      Perm.countDocuments({
        _id: { $in: uPermIds },
      }),
    ]);
    if (!item) {
      throw new BadReqErr("not found");
    }
    if (permIds && permCount < uPermIds.length) {
      throw new BadReqErr("perm mismatch");
    }

    const updItem = await PermGr.findByIdAndUpdate(
      item._id,
      {
        $set: {
          name,
          perms: uPermIds,
        },
      },
      { new: true }
    ).populate({
      path: "perms",
      select: "-group",
    });

    res.json({ group: updItem });

    await Promise.all([
      permIds &&
        (await Promise.all([
          Perm.deleteMany({
            _id: item.perms.filter((p) => !uPermIds.includes(p)),
          }),
          Perm.updateMany(
            {
              _id: {
                $in: uPermIds,
              },
            },
            {
              $set: {
                group: item._id,
              },
            }
          ),
        ])),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: PermGr.modelName,
        act: Actions.update,
        doc: item,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
