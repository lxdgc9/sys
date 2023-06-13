import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";
import { Class } from "../../models/class";

const readClasses: RequestHandler = async (req, res, next) => {
  try {
    if (!req.query.school_id) {
      const classes = await Class.find()
        .lean()
        .populate([
          {
            path: "school",
            select: "-classes",
          },
          {
            path: "members",
            select: "-classes",
          },
        ]);
      res.json(classes);
      return;
    }

    const school = await School.findById(req.query.school_id)
      .lean()
      .populate({
        path: "classes",
        populate: [
          {
            path: "school",
            select: "-classes",
          },
          {
            path: "members",
            select: "-classes",
          },
        ],
      });
    if (!school) {
      throw new BadReqErr("School not found");
    }

    const classes = school.classes;
    res.json(classes);
  } catch (e) {
    next(e);
  }
};

export default readClasses;
