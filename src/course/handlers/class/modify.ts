import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";
import { School } from "../../models/school";

const modifyClass: RequestHandler = async (req, res, next) => {
  const {
    name,
    school_id,
  }: {
    name: string | undefined;
    school_id: Types.ObjectId | undefined;
  } = req.body;

  try {
    if (name === undefined && school_id === undefined) {
      throw new BadReqErr("Missing fields");
    }

    const [hasClass, hasSchool] = await Promise.all([
      Class.exists({ _id: req.params.id }),
      School.exists({ _id: school_id }),
    ]);
    if (!hasClass) {
      throw new BadReqErr("Class not found");
    }
    if (!hasSchool) {
      throw new BadReqErr("School not found");
    }

    const modClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          school: school_id,
        },
      },
      { new: true }
    )
      .lean()
      .populate([
        {
          path: "school",
          select: "-classses",
        },
        {
          path: "members",
          select: "-classses",
        },
      ]);
    res.json(modClass);

    await Promise.allSettled([
      School.updateOne(
        { _id: school_id },
        {
          $pull: {
            classes: req.params.id,
          },
        }
      ),
      School.updateOne(
        { _id: modClass!.school._id },
        {
          $addToSet: {
            classes: req.params.id,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};

export default modifyClass;
