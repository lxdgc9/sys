import { RequestHandler } from "express";
import { Types } from "mongoose";
import { User } from "../../models/user";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const allocUsers: RequestHandler = async (req, res, next) => {
  const {
    user_ids,
    school_id,
  }: {
    user_ids: Types.ObjectId[];
    school_id: Types.ObjectId;
  } = req.body;

  try {
    const [numUsers, hasSchool] = await Promise.all([
      User.countDocuments({
        _id: { $in: user_ids },
      }),
      School.exists({ _id: school_id }),
    ]);
    if (numUsers < user_ids.length) {
      throw new BadReqErr("Invalid user_ids");
    }
    if (!hasSchool) {
      throw new BadReqErr("School not found");
    }

    await Promise.allSettled([
      User.updateMany(
        { _id: { $in: user_ids } },
        {
          $addToSet: {
            schools: school_id,
          },
        }
      ),
      School.updateOne(
        { _id: school_id },
        {
          $addToSet: {
            members: user_ids,
          },
        }
      ),
    ]);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default allocUsers;
