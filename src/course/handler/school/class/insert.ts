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
    // Tập hợp members thuộc đầu vào, loại bỏ phần tử trùng
    const memberIdArr = Array.from(new Set(memberIds));

    // Kiểm tra đầu vào: id trường học có tồn tại trong db hay không,
    // danh sách id member có phần tử nào không hợp lệ hay không
    const [exSchool, numMembers] = await Promise.all([
      School.exists({ _id: schoolId }),
      User.countDocuments({
        _id: {
          $in: memberIdArr,
        },
      }),
    ]);
    if (!exSchool) {
      throw new BadReqErr("school not found");
    }
    if (numMembers < memberIdArr.length) {
      throw new BadReqErr("memberIds mismatch");
    }

    const newClass = new Class({
      name,
      school: schoolId,
      members: memberIdArr,
    });
    await newClass.save();

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
            $in: memberIdArr,
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
