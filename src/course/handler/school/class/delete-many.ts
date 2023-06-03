import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { School } from "../../../model/school";
import { User } from "../../../model/user";

export const delItems: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const uids = Array.from(new Set(ids));

    const itemCount = await Class.countDocuments({
      _id: { $in: uids },
    });
    if (itemCount < uids.length) {
      throw new BadReqErr("mismatch");
    }

    await Class.deleteMany({
      _id: { $in: uids },
    });

    res.json({ msg: "ok" });

    await Promise.all([
      School.updateMany(
        {
          classes: { $in: uids },
        },
        {
          $pullAll: {
            classes: uids,
          },
        }
      ),
      User.updateMany(
        {
          classes: { $in: uids },
        },
        {
          $pullAll: {
            classes: uids,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};
