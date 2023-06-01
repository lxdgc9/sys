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

    const docs = await Class.insertMany(
      classes.map(({ name, schoolId, memberIds }) => ({
        name,
        school: schoolId,
        members: Array.from(new Set(memberIds)),
      }))
    );

    const [ids, mapSchools, mapMembers] = docs.reduce(
      (map, { _id, school, members }) => {
        map[0].add(_id);

        const schoolStr = school.toString();
        if (!map[1].has(schoolStr)) {
          map[1].set(schoolStr, []);
        }
        map[1].get(schoolStr).push(_id);

        members.forEach((m) => {
          const mStr = m.toString();
          if (!map[2].has(mStr)) {
            map[2].set(mStr, []);
          }
          map[2].get(mStr).push(_id);
        });

        return map;
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
