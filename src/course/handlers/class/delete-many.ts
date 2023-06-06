import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../models/class";
import { School } from "../../models/school";

export const delItems: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = Array.from(new Set(req.body));

  try {
    const items = await Class.find({
      _id: { $in: ids },
    });
    if (items.length < ids.length) {
      throw new BadReqErr("ids mismatch");
    }
    if (items.some((el) => el.members.length)) {
      throw new BadReqErr("found dependent");
    }

    await Class.deleteMany({
      _id: { $in: ids },
    });

    res.json({ msg: "ok" });

    await School.updateMany(
      {
        classes: { $in: ids },
      },
      {
        $pullAll: {
          classes: ids,
        },
      }
    );
  } catch (e) {
    next(e);
  }
};
