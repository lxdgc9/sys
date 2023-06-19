import { RequestHandler } from "express";
import { User } from "../../models/user";
import { BadReqErr, NotFoundErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const readMyClassesBySchool: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user?.id });
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }

    if (!user.schools.some((el) => el.equals(req.params.school_id))) {
      throw new BadReqErr("Invalid school");
    }

    const school = await School.findById(req.params.school_id).populate(
      "classes"
    );
    if (!school) {
      throw new NotFoundErr("School not found");
    }

    res.json(school.classes);
  } catch (e) {
    next(e);
  }
};

export default readMyClassesBySchool;
