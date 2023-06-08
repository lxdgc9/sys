import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { School } from "../../models/school";
import { User } from "../../models/user";

export const allocUser: RequestHandler = async (req, res, next) => {
  const {
    user_id,
    school_ids,
  }: {
    user_id: Types.ObjectId;
    school_ids: Types.ObjectId[];
  } = req.body;

  const schoolIds = Array.from(new Set(school_ids));

  try {
    const [user, schoolCount] = await Promise.all([
      User.findById(user_id),
      School.countDocuments({
        _id: { $in: schoolIds },
      }),
    ]);
    if (!user) {
      throw new BadReqErr("user_id not found");
    }
    if (schoolCount < schoolIds.length) {
      throw new BadReqErr("school_ids mismatch");
    }

    await user.updateOne({
      $addToSet: {
        schools: schoolIds,
      },
    });

    res.json(
      await User.findById(user_id).populate({
        path: "schools",
        select: "-classes",
      })
    );
  } catch (e) {
    next(e);
  }
};
