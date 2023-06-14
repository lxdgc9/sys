import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { Class } from "../../models/class";

const grantUsersToClass: RequestHandler = async (req, res, next) => {
  const {
    user_ids,
    class_id,
  }: {
    user_ids: Types.ObjectId[];
    class_id: Types.ObjectId;
  } = req.body;

  try {
    const [numUsers, hasClass] = await Promise.all([
      User.countDocuments({ _id: user_ids }),
      Class.exists({ _id: class_id }),
    ]);
    if (numUsers < user_ids.length) {
      throw new BadReqErr("Users mismatch");
    }
    if (!hasClass) {
      throw new BadReqErr("Class not found");
    }

    await User.updateMany(
      { _id: { $in: user_ids } },
      {
        $addToSet: {
          classes: class_id,
        },
      }
    );

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default grantUsersToClass;
