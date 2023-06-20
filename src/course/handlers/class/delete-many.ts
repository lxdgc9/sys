import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";
import { School } from "../../models/school";

const delClasses: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const classes = await Class.find({ _id: { $in: ids } });
    if (classes.length < ids.length) {
      throw new BadReqErr("Invalid body");
    }
    if (classes.some((el) => el.members.length)) {
      throw new BadReqErr("Found dependent");
    }

    await Class.deleteMany({ _id: { $in: ids } });
    res.sendStatus(204);

    await School.updateMany(
      { classes: { $in: ids } },
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

export default delClasses;
