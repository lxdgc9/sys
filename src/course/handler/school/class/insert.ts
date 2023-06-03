import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { School } from "../../../model/school";
import { User } from "../../../model/user";

export const insrtItem: RequestHandler = async (req, res, next) => {
  const {
    name,
    school_id: schId,
    member_ids: memIds,
  }: {
    name: string;
    school_id: Types.ObjectId;
    member_ids: Types.ObjectId[];
  } = req.body;

  try {
    const uMemIds = Array.from(new Set(memIds));

    const [exstSch, memCount] = await Promise.all([
      School.exists({ _id: schId }),
      User.countDocuments({
        _id: { $in: uMemIds },
      }),
    ]);
    if (!exstSch) {
      throw new BadReqErr("school not found");
    }
    if (memCount < uMemIds.length) {
      throw new BadReqErr("members mismatch");
    }

    const newItem = new Class({
      name,
      school: schId,
      members: uMemIds,
    });
    await newItem.save();

    res.status(201).json({
      class: await Class.populate(newItem, [
        {
          path: "school",
          select: "-classes",
        },
        {
          path: "members",
          select: "obj",
        },
      ]),
    });

    await Promise.all([
      School.findByIdAndUpdate(newItem.school._id, {
        $addToSet: {
          classes: newItem._id,
        },
      }),
      User.updateMany(
        {
          _id: { $in: uMemIds },
        },
        {
          $addToSet: {
            classes: newItem._id,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};
