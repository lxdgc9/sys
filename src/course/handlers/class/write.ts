import { RequestHandler } from "express";
import { Types } from "mongoose";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";
import { School } from "../../models/school";

const writeClass: RequestHandler = async (req, res, next) => {
  const {
    name,
    school_id,
  }: {
    name: string;
    school_id: Types.ObjectId;
  } = req.body;

  try {
    const hasSchool = await School.exists({ _id: school_id });
    if (!hasSchool) {
      throw new NotFoundErr("School not found");
    }

    const nClass = new Class({
      name,
      school: school_id,
    });
    await nClass.save();
    await nClass.populate("school", "-classes");
    res.status(201).json(nClass);

    await School.updateOne(
      { _id: school_id },
      {
        $addToSet: {
          classes: nClass,
        },
      }
    );
  } catch (e) {
    next(e);
  }
};

export default writeClass;
