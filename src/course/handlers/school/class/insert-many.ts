import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../models/class";
import { School } from "../../../models/school";
import { User } from "../../../models/user";

export const insrtItems: RequestHandler = async (req, res, next) => {
  const items: {
    name: string;
    school_id: Types.ObjectId;
    member_ids: Types.ObjectId[];
  }[] = req.body;

  try {
    const [uSchId, uMemIds] = items
      .reduce(
        (a, { school_id: schId, member_ids: memIds }) => {
          a[0].add(schId);

          memIds.forEach(a[1].add, a[1]);

          return a;
        },
        [new Set(), new Set()]
      )
      .map((e) => Array.from(e));

    const [schCount, memCount] = await Promise.all([
      School.countDocuments({
        _id: { $in: uSchId },
      }),
      User.countDocuments({
        _id: { $in: uMemIds },
      }),
    ]);
    if (schCount < uSchId.length) {
      throw new BadReqErr("schools mismatch");
    }
    if (memCount < uMemIds.length) {
      throw new BadReqErr("members mismatch");
    }

    const newItems = await Class.insertMany(
      items.map(({ name, school_id: schId, member_ids: memIds }) => ({
        name,
        school: schId,
        members: Array.from(new Set(memIds)),
      }))
    );

    res.status(201).json({
      classes: await Class.populate(newItems, {
        path: "school",
        select: "-classes",
      }),
    });

    const [arr2dSchs, arr2dMems] = newItems
      .reduce(
        (a, { _id, school, members }) => {
          const key = school._id.toString();
          if (!a[0].has(key)) {
            a[0].set(key, []);
          }
          a[0].get(key).push(_id);

          members.forEach((id) => {
            const key = id._id.toString();
            if (!a[1].has(key)) {
              a[1].set(key, []);
            }
            a[1].get(key).push(_id);
          });

          return a;
        },
        [new Map(), new Map()]
      )
      .map((e) => Array.from(e));

    arr2dSchs.forEach(async ([k, v]) => {
      await School.findByIdAndUpdate(k, {
        $addToSet: {
          classes: v,
        },
      });
    });

    arr2dMems.forEach(async ([k, v]) => {
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
