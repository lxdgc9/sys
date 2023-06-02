import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { timer } from "../../../helper/timer";
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

  console.group("Handler: deleteClass");
  const breakPoint01 = timer.breakPoint();

  try {
    const uniqMemberIds = Array.from(new Set(memberIds));
    timer.cal("Unique memberIds", breakPoint01);

    const breakPoint02 = timer.breakPoint();
    const [exSchool, numMembers] = await Promise.all([
      School.exists({ _id: schoolId }),
      User.countDocuments({
        _id: {
          $in: uniqMemberIds,
        },
      }),
    ]);
    if (!exSchool) {
      throw new BadReqErr("school not found");
    }
    if (numMembers < uniqMemberIds.length) {
      throw new BadReqErr("memberIds mismatch");
    }
    timer.cal("Validate schoolId, memberIds", breakPoint02);

    const breakPoint03 = timer.breakPoint();
    const newClass = new Class({
      name,
      school: schoolId,
      members: uniqMemberIds,
    });
    await newClass.save();
    timer.cal("Insert class", breakPoint03);

    const _class = await Class.findById(newClass._id).populate([
      {
        path: "school",
        select: "-classes",
      },
      {
        path: "members",
        select: "obj",
      },
    ]);

    res.status(201).json({ class: _class });

    await Promise.all([
      // Thêm lớp vào danh sách tương ứng trường học
      School.findByIdAndUpdate(newClass.school, {
        $addToSet: {
          classes: newClass._id,
        },
      }),
      // Thêm lớp vào danh sách nếu là member của lớp đó
      User.updateMany(
        {
          _id: {
            $in: uniqMemberIds,
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

  timer.cal("Total", breakPoint01);
  console.groupEnd();
};
