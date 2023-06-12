import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../models/class";
import { School } from "../../models/school";
import { User } from "../../models/user";

export const createClass: RequestHandler = async (req, res, next) => {
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
    const memIds = [...new Set(member_ids)];

    const [school, numUsers] = await Promise.all([
      School.findById(school_id),
      User.countDocuments({
        _id: { $in: memIds },
      }),
    ]);
    if (!school) {
      throw new BadReqErr("school not found");
    }
    if (numUsers < memIds.length) {
      throw new BadReqErr("members mismatch");
    }

    const newClass = new Class({
      name,
      school: school_id,
      members: memIds,
    });
    await newClass.save();

    await Class.populate(newClass, [
      {
        path: "school",
        select: "-classes",
      },
      {
        path: "members",
        select: "data",
      },
    ]);

    res.status(201).json(newClass);

    await Promise.allSettled([
      school.updateOne({
        $addToSet: {
          classes: newClass,
        },
      }),
      User.updateMany(
        {
          _id: { $in: memIds },
        },
        {
          $addToSet: {
            classes: newClass,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};
