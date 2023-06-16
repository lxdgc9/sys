import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { Class } from "../../models/class";

const grantUserToClass: RequestHandler = async (req, res, next) => {
  const {
    user_id,
    class_id,
  }: {
    user_id: Types.ObjectId;
    class_id: Types.ObjectId;
  } = req.body;

  try {
    const [hasUser, _class] = await Promise.all([
      User.exists({ _id: user_id }),
      Class.findById(class_id)
        .lean()
        .select("schools")
        .populate<{ school: { members: Types.ObjectId[] } }>(
          "school",
          "members"
        ),
    ]);
    if (!hasUser) {
      throw new BadReqErr("User not found");
    }
    if (!_class) {
      throw new BadReqErr("Class not found");
    }

    if (!_class.school.members.some((el) => el.equals(user_id))) {
      throw new BadReqErr("Invalid user_id, must be in school");
    }

    await Promise.allSettled([
      User.updateOne(
        { _id: user_id },
        {
          $addToSet: {
            classes: class_id,
          },
        }
      ),
      Class.updateOne(
        { _id: class_id },
        {
          $addToSet: {
            members: user_id,
          },
        }
      ),
    ]);

    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export default grantUserToClass;
