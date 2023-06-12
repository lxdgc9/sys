import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../models/class";
import { School } from "../../models/school";
import { User } from "../../models/user";

export const writeClasses: RequestHandler = async (req, res, next) => {
  const classes: {
    name: string;
    school_id: Types.ObjectId;
    member_ids: Types.ObjectId[];
  }[] = req.body;

  try {
    const [schoolIds, memberIds] = classes
      .reduce(
        (a, _class) => {
          a[0].add(_class.school_id);
          _class.member_ids.forEach(a[1].add, a[1]);
          return a;
        },
        [new Set(), new Set()]
      )
      .map((set) => Array.from(set));

    const [numSchools, numUsers] = await Promise.all([
      School.countDocuments({
        _id: { $in: schoolIds },
      }),
      User.countDocuments({
        _id: { $in: memberIds },
      }),
    ]);
    if (numSchools < schoolIds.length) {
      throw new BadReqErr("School mismatch");
    }
    if (numUsers < memberIds.length) {
      throw new BadReqErr("Member mismatch");
    }

    const newClasses = await Class.insertMany(
      classes.map((_class) => ({
        name: _class.name,
        school: _class.school_id,
        members: Array.from(new Set(_class.member_ids)),
      }))
    );

    await Class.populate(newClasses, {
      path: "school",
      select: "-classes",
    });

    res.status(201).json(newClasses);

    const [arr2dSchool, arr2dMember] = newClasses
      .reduce(
        (a, { _id, school, members }) => {
          const key = school._id.toString();
          if (!a[0].has(key)) {
            a[0].set(key, []);
          }
          a[0].get(key).push(_id);

          members.forEach((mem) => {
            const key = mem._id.toString();
            if (!a[1].has(key)) {
              a[1].set(key, []);
            }
            a[1].get(key).push(_id);
          });

          return a;
        },
        [new Map(), new Map()]
      )
      .map((map) => Array.from(map));

    arr2dSchool.forEach(async ([k, v]) => {
      await School.findByIdAndUpdate(k, {
        $addToSet: {
          classes: v,
        },
      });
    });

    arr2dMember.forEach(async ([k, v]) => {
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
