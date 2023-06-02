import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
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
    // Lấy tập hợp trường học và thành viên được sử dụng ở đầu vào
    const [schoolArr, memberArr] = classes
      .reduce(
        (s, { schoolId, memberIds }) => {
          s[0].add(schoolId);
          memberIds.forEach(s[1].add, s[1]);
          return s;
        },
        [new Set(), new Set()]
      )
      .map((el) => Array.from(el));

    // Validate danh sách trường học và thành viên xem có phần tử nào
    // không tồn tại trong db hay không?
    const [numSchools, numMembers] = await Promise.all([
      School.countDocuments({
        _id: {
          $in: schoolArr,
        },
      }),
      User.countDocuments({
        _id: {
          $in: memberArr,
        },
      }),
    ]);
    if (numSchools < schoolArr.length) {
      throw new BadReqErr("schoolId mismatch");
    }
    if (numMembers < memberArr.length) {
      throw new BadReqErr("memberIds mismatch");
    }

    // Tiến hành thêm danh sách lớp học vào db
    const docs = await Class.insertMany(
      classes.map(({ name, schoolId, memberIds }) => ({
        name,
        school: schoolId,
        members: Array.from(new Set(memberIds)),
      }))
    );

    const [ids, mapSchools, mapMembers] = docs.reduce(
      (a, { _id, school, members }) => {
        a[0].add(_id);

        const schoolStr = school.toString();
        if (!a[1].has(schoolStr)) {
          a[1].set(schoolStr, []);
        }
        a[1].get(schoolStr).push(_id);

        members.forEach((m) => {
          const mStr = m.toString();
          if (!a[2].has(mStr)) {
            a[2].set(mStr, []);
          }
          a[2].get(mStr).push(_id);
        });

        return a;
      },
      [new Set(), new Map(), new Map()]
    );

    const _classes = await Class.find({
      _id: {
        $in: Array.from(ids),
      },
    })
      .select("-members")
      .populate({
        path: "school",
        select: "-classes",
      });

    res.status(201).json({ classes: _classes });

    // Cập nhật danh sách lớp đã thêm vào school
    Array.from(mapSchools.entries()).forEach(async ([k, v]) => {
      await School.findByIdAndUpdate(k, {
        $addToSet: {
          classes: v,
        },
      });
    });

    // Cập nhật danh sách lớp đã thêm vào users
    Array.from(mapMembers.entries()).forEach(async ([k, v]) => {
      await User.findByIdAndUpdate(k, {
        $addToSet: {
          classes: v,
        },
      });
    });
  } catch (e) {
    next(e);
  }
};
