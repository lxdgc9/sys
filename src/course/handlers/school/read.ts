import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const readSchool: RequestHandler = async (req, res, next) => {
  try {
    const school = await School.findById(req.params.id).populate([
      { path: "classes", select: "name" },
      { path: "members" },
    ]);
    if (!school) {
      throw new NotFoundErr("School not found");
    }

    res.json(school);
  } catch (e) {
    next(e);
  }
};

export default readSchool;
