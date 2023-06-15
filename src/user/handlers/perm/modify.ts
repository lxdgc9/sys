import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";

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

    const perm = await Rule.findById(req.params.id).lean();
    if (!perm) {
      throw new BadReqErr("Permission not found");
    }

    const [dupl, existGroup] = await Promise.all([
      code &&
        Rule.exists({
          $and: [
            {
              _id: { $ne: perm._id },
            },
            { code: code },
          ],
        }),
      perm_group_id &&
        Catalog.exists({
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

    const modPerm = await Rule.findByIdAndUpdate(
      perm._id,
      {
        $set: {
          code: code,
          detail: info,
          group_id: perm_group_id,
        },
      },
      { new: true }
    )
      .lean()
      .populate({
        path: "perm_group",
        select: "-items",
      });
    res.json(modPerm);

    await Promise.allSettled([
      Catalog.updateOne(
        { _id: perm.catalog },
        {
          $pull: {
            rules: perm._id,
          },
        }
      ),
      Catalog.updateOne(
        { _id: modPerm!.catalog._id },
        {
          $addToSet: {
            rules: perm._id,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Rule.modelName,
        action: "update",
        data: modPerm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default modifyPerm;
