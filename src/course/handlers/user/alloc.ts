import { RequestHandler } from "express";
import { Types } from "mongoose";
import { User } from "../../models/user";
import { School } from "../../models/school";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";

const allocUser: RequestHandler = async (req, res, next) => {
  const {
    user_id,
    school_id,
  }: {
    user_id: Types.ObjectId;
    school_id: Types.ObjectId;
  } = req.body;

  try {
    const [hasUser, hasSchool] = await Promise.all([
      User.exists({ _id: user_id }),
      School.exists({ _id: school_id }),
    ]);
    if (!hasUser) {
      throw new BadReqErr("User not found");
    }
    if (!hasSchool) {
      throw new BadReqErr("School not found");
    }

    await Promise.allSettled([
      User.updateOne(
        { _id: user_id },
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
            members: user_id,
          },
        }
      ),
    ]);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default allocUser;
