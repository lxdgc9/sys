import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../models/class";
import { School } from "../../models/school";
import { User } from "../../models/user";

export const writeItems: RequestHandler = async (req, res, next) => {
  const items: {
    name: string;
    school_id: Types.ObjectId;
    member_ids: Types.ObjectId[];
  }[] = req.body;

  try {
    const [uSchIds, uMemIds] = items
      .reduce(
        (a, { school_id, member_ids }) => {
          a[0].add(school_id);

          member_ids.forEach(a[1].add, a[1]);

          return a;
        },
        [new Set(), new Set()]
      )
      .map((set) => Array.from(set));

    const [schCount, userCount] = await Promise.all([
      School.countDocuments({
        _id: { $in: uSchIds },
      }),
      User.countDocuments({
        _id: { $in: uMemIds },
      }),
    ]);
    if (schCount < uSchIds.length) {
      throw new BadReqErr("schools mismatch");
    }
    if (userCount < uMemIds.length) {
      throw new BadReqErr("members mismatch");
    }

    const nItems = await Class.insertMany(
      items.map(({ name, school_id, member_ids }) => ({
        name,
        school: school_id,
        members: Array.from(new Set(member_ids)),
      }))
    );

    res.status(201).json({
      classes: await Class.populate(nItems, {
        path: "school",
        select: "-classes",
      }),
    });

    const [arr2dSchool, arr2dMember] = nItems
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
