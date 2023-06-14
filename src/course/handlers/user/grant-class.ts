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
    const [hasUser, haveClass] = await Promise.all([
      User.exists({ _id: user_id }),
      Class.exists({ _id: class_id }),
    ]);
    if (!hasUser) {
      throw new BadReqErr("User not found");
    }
    if (haveClass) {
      throw new BadReqErr("Class not found");
    }

    await User.updateOne(
      { _id: user_id },
      {
        $addToSet: {
          classes: Class,
        },
      }
    );

    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export default grantUserToClass;
