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

  const schoolIds = [...new Set(school_ids)];

  try {
    const [user, numSchools] = await Promise.all([
      User.findById(user_id),
      School.countDocuments({
        _id: { $in: schoolIds },
      }),
    ]);
    if (!user) {
      throw new BadReqErr("User not found");
    }
    if (numSchools < schoolIds.length) {
      throw new BadReqErr("School mismatch");
    }

    await user.updateOne({
      $addToSet: {
        schools: schoolIds,
      },
    });

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};
