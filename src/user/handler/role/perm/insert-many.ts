import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";

export const insertManyPerm: RequestHandler = async (req, res, next) => {
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
    if (set.size !== perms.length) {
      throw new BadReqErr("duplicate code");
    }

    const [isDupl, numGroups] = await Promise.all([
      Perm.exists({
        _id: {
          $in: Array.from(set),
        },
      }),
      PermGr.countDocuments({
        _id: {
          $in: perms.map((p) => p.groupId),
        },
      }),
    ]);
    if (isDupl) {
      throw new BadReqErr("duplicate code");
    }
    if (numGroups < perms.length) {
      throw new BadReqErr("group not found");
    }

    const _perms = await Perm.updateMany(perms);

    console.log(_perms);

    // for (const p of _perms) {
    //   await PermGr.findByIdAndUpdate(p.)
    // }

    res.status(201).json({});
  } catch (e) {
    next(e);
  }
};
