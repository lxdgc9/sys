import { RequestHandler } from "express";
import { NotFoundErr, UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { School } from "../../models/school";
import { Types } from "mongoose";

const readMyClassesBySchool: RequestHandler = async (req, res, next) => {
  try {
    const [user, hasSchool] = await Promise.all([
      User.findOne({ user_id: req.user?.id })
        .select("classes")
        .populate<{
          classes: {
            school: Types.ObjectId;
          }[];
        }>({
          path: "classes",
          populate: {
            path: "members",
            select: "-school -classes",
          },
        }),
      School.exists({ _id: req.params.school_id }),
    ]);
    if (!user) {
      throw new UnauthorizedErr("Invalid token");
    }
    if (!hasSchool) {
      throw new NotFoundErr("School not found");
    }

    const classes = user.classes.filter((el) => {
      return el.school._id.equals(req.params.school_id);
    });

    res.json(classes);
  } catch (e) {
    next(e);
  }
};

export default readMyClassesBySchool;
