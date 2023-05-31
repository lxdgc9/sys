import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { School } from "../../../model/school";
import { User } from "../../../model/user";

export const insertClass: RequestHandler = async (req, res, next) => {
  const {
    name,
    schoolId,
    memberIds,
  }: {
    name: string;
    schoolId: Types.ObjectId;
    memberIds: Types.ObjectId[];
  } = req.body;

  try {
    const [exSchool, numMembers] = await Promise.all([
      School.exists({ _id: schoolId }),
      User.countDocuments({
        _id: {
          $in: memberIds,
        },
      }),
    ]);
    if (!exSchool) {
      throw new BadReqErr("unit not found");
    }
    if (numMembers < memberIds.length) {
      throw new BadReqErr("memberIds mismatch");
    }

    const newClass = new Class({
      name,
      school: schoolId,
      members: memberIds,
    });
    await newClass.save();

    const _class = await Class.findById(newClass._id).populate({
      path: "school",
      select: "-classes",
    });

    res.status(201).json({ class: _class });

    await Promise.all([
      School.findByIdAndUpdate(newClass.school, {
        $addToSet: {
          classes: newClass._id,
        },
      }),
      User.updateMany(
        {
          _id: {
            $in: memberIds,
          },
        },
        {
          $addToSet: {
            classes: newClass._id,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};
