import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { School } from "../../../model/school";
import { User } from "../../../model/user";

export const insertClasses: RequestHandler = async (req, res, next) => {
  const {
    classes,
  }: {
    classes: {
      name: string;
      schoolId: Types.ObjectId;
      memberIds: Types.ObjectId[];
    }[];
  } = req.body;

  try {
    const [setSchools, setMembers] = classes.reduce(
      (s, { schoolId, memberIds }) => {
        s[0].add(schoolId);
        memberIds.forEach(s[1].add, s[1]);
        return s;
      },
      [new Set(), new Set()]
    );

    const [numSchools, numMembers] = await Promise.all([
      School.countDocuments({
        _id: {
          $in: Array.from(setSchools),
        },
      }),
      User.countDocuments({
        _id: {
          $in: Array.from(setMembers),
        },
      }),
    ]);
    if (numSchools < setSchools.size) {
      throw new BadReqErr("schoolId mismatch");
    }
    if (numMembers < setMembers.size) {
      throw new BadReqErr("memberIds mismatch");
    }

    // const [exUnit, numMembers] = await Promise.all([
    //   School.exists({ _id: school }),
    //   User.countDocuments({
    //     _id: {
    //       $in: memberIds,
    //     },
    //   }),
    // ]);
    // if (!exUnit) {
    //   throw new BadReqErr("unit not found");
    // }
    // if (numMembers < memberIds.length) {
    //   throw new BadReqErr("memberIds mismatch");
    // }

    // const newClass = new Class({
    //   name,
    //   school,
    //   members: memberIds,
    // });
    // await newClass.save();

    // const _class = await Class.findById(newClass._id).populate({
    //   path: "school",
    //   select: "-classes",
    // });

    // res.status(201).json({ class: _class });

    // await Promise.all([
    //   School.findByIdAndUpdate(newClass.school, {
    //     $addToSet: {
    //       classes: newClass._id,
    //     },
    //   }),
    //   User.updateMany(
    //     {
    //       _id: {
    //         $in: memberIds,
    //       },
    //     },
    //     {
    //       $addToSet: {
    //         classes: newClass._id,
    //       },
    //     }
    //   ),
    // ]);
  } catch (e) {
    next(e);
  }
};
