import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../models/class";
import { School } from "../../models/school";
import { User } from "../../models/user";

export const writeItem: RequestHandler = async (req, res, next) => {
  const {
    name,
    school_id,
    member_ids,
  }: {
    name: string;
    school_id: Types.ObjectId;
    member_ids: Types.ObjectId[];
  } = req.body;

  try {
    const uMemIds = Array.from(new Set(member_ids));

    const [school, userCount] = await Promise.all([
      School.findById(school_id),
      User.countDocuments({
        _id: { $in: uMemIds },
      }),
    ]);
    if (!school) {
      throw new BadReqErr("school not found");
    }
    if (userCount < uMemIds.length) {
      throw new BadReqErr("members mismatch");
    }

    const nItem = new Class({
      name,
      school: school_id,
      members: uMemIds,
    });
    await nItem.save();

    res.status(201).json({
      class: await Class.populate(nItem, [
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
      school.updateOne({
        $addToSet: {
          classes: nItem._id,
        },
      }),
      User.updateMany(
        {
          _id: { $in: uMemIds },
        },
        {
          $addToSet: {
            classes: nItem._id,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};
