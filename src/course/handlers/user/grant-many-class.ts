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
    const [numUsers, _class] = await Promise.all([
      User.countDocuments({ _id: user_ids }),
      Class.findById(class_id)
        .select("schools")
        .populate<{ school: { members: Types.ObjectId[] } }>(
          "school",
          "members"
        ),
    ]);
    if (numUsers < user_ids.length) {
      throw new BadReqErr("Invalid user_ids");
    }
    if (!_class) {
      throw new BadReqErr("Class not found");
    }

    const memberIds = _class.school.members;
    if (!user_ids.every((user) => memberIds.some((mem) => mem.equals(user)))) {
      throw new BadReqErr("Invalid user_ids, must be in school");
    }

    await Promise.allSettled([
      User.updateMany(
        { _id: { $in: user_ids } },
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

export default grantUsersToClass;
