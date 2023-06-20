import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const readClassesBySchool: RequestHandler = async (req, res, next) => {
  try {
    const school = await School.findById(req.params.school_id)
      .lean()
      .select("classes")
      .populate({
        path: "classes",
        select: "-school",
        populate: {
          path: "members",
          select: "-school -classes",
        },
      });
    if (!school) {
      throw new NotFoundErr("School not found");
    }

    res.json(school.classes);
  } catch (e) {
    next(e);
  }
};

export default readClassesBySchool;
