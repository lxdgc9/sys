import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { User } from "../../../model/user";

export const allocUser: RequestHandler = async (req, res, next) => {
  const {
    userId,
    classIds,
  }: {
    userId: Types.ObjectId;
    classIds: Types.ObjectId[];
  } = req.body;

  try {
    // Loại bỏ phần tử trùng
    const classArr = Array.from(new Set(classIds));

    const [user, numClassIds] = await Promise.all([
      User.findById(userId),
      Class.countDocuments({
        _id: {
          $in: classArr,
        },
      }),
    ]);
    if (!user) {
      throw new BadReqErr("userId mismatch");
    }
    if (numClassIds < classArr.length) {
      throw new BadReqErr("classIds mismatch");
    }

    await user.updateOne({
      $addToSet: {
        classes: classArr,
      },
    });

    res.json({
      numClasses: numClassIds,
    });
  } catch (e) {
    next(e);
  }
};
