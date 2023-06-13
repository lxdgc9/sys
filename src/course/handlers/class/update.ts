import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";
import { School } from "../../models/school";
import { User } from "../../models/user";

const modifyClass: RequestHandler = async (req, res, next) => {
  const {
    name,
    schoolId,
    memberIds,
  }: {
    name?: string;
    schoolId?: Types.ObjectId;
    memberIds?: Types.ObjectId[];
  } = req.body;

  try {
    const [_class, exSchool, numMembers] = await Promise.all([
      Class.findById(req.params.id),
      School.exists({ _id: schoolId }),
      User.countDocuments({
        _id: {
          $in: memberIds,
        },
      }),
    ]);
    if (!_class) {
      throw new BadReqErr("class not found");
    }
    if (schoolId && !exSchool) {
      throw new BadReqErr("school not found");
    }
    if (memberIds?.length && numMembers < memberIds.length) {
      throw new BadReqErr("members mismatch");
    }

    await Promise.all([
      _class.updateOne({
        $set: {
          name,
          school: schoolId,
          members: memberIds,
        },
      }),
      schoolId &&
        !_class.school.equals(schoolId) &&
        Promise.all([
          School.findByIdAndUpdate(schoolId, {
            $addToSet: {
              classes: _class._id,
            },
          }),
          School.findByIdAndUpdate(_class.school, {
            $pull: {
              classes: _class._id,
            },
          }),
        ]),
    ]);

    const updClass = await Class.findById(_class._id).populate({
      path: "school",
      select: "-classes",
    });

    res.json(updClass);
  } catch (e) {
    next(e);
  }
};

export default modifyClass;
