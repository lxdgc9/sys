import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const insertPerms: RequestHandler = async (req, res, next) => {
  const {
    perms,
  }: {
    perms: {
      code: string;
      desc: string;
      groupId: Types.ObjectId;
    }[];
  } = req.body;

  try {
    const set = new Set(perms.map((p) => p.code));
    if (set.size < perms.length) {
      throw new BadReqErr("duplicate code");
    }

    const setGroupId = new Set(perms.map((p) => p.groupId));
    const [isDupl, numGroups] = await Promise.all([
      Perm.exists({
        code: {
          $in: Array.from(set),
        },
      }),
      PermGr.countDocuments({
        _id: {
          $in: Array.from(setGroupId),
        },
      }),
    ]);

    if (isDupl) {
      throw new BadReqErr("duplicate code");
    }
    if (numGroups < setGroupId.size) {
      throw new BadReqErr("groupIds mismatch");
    }

    const _perms = await Perm.insertMany(
      perms.map(({ code, desc, groupId }) => ({
        code,
        desc,
        group: groupId,
      }))
    );

    const docs = await Perm.find({
      _id: {
        $in: _perms.map((p) => p._id),
      },
    }).populate({
      path: "group",
      select: "-perms",
    });

    res.status(201).json({ perm: docs });

    const permByGroupIds = _perms.reduce((a, { _id, group }) => {
      if (!a.has(group.toString())) {
        a.set(group.toString(), []);
      }

      a.get(group.toString()).push(_id);

      return a;
    }, new Map());

    await Promise.all([
      Array.from(permByGroupIds.entries()).forEach(async ([k, v]) => {
        await PermGr.findByIdAndUpdate(k, {
          $addToSet: {
            perms: v,
          },
        });
      }),
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Perm.modelName,
        act: Actions.insert,
        doc: docs,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
