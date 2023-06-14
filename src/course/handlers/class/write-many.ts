import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";
import { School } from "../../models/school";

const writeClasses: RequestHandler = async (req, res, next) => {
  const classes: {
    name: string;
    school_id: Types.ObjectId;
  }[] = req.body;

  const schoolIds = [...new Set(classes.map((el) => el.school_id))];

  try {
    const numSchools = await School.countDocuments({
      _id: { $in: schoolIds },
    });
    if (numSchools < schoolIds.length) {
      throw new BadReqErr("Schools mismatch");
    }

    const nClasses = await Class.insertMany(
      classes.map((el) => ({
        name: el.name,
        school: el.school_id,
      }))
    );
    res.status(201).json(nClasses);

    const mapSchool = nClasses.reduce((m, el) => {
      const k = el.school.toString();
      if (!m.has(k)) {
        m.set(k, []);
      }
      m.get(k).push(el._id);
      return m;
    }, new Map());

    [...mapSchool.entries()].forEach(async ([k, v]) => {
      await School.updateOne(
        { _id: k },
        {
          $addToSet: {
            classes: v,
          },
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

export default writeClasses;
