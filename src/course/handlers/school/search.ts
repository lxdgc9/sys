import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { School } from "../../models/school";

export const getSchool: RequestHandler = async (req, res, next) => {
  try {
    const school = await School.findById(req.params.id).populate({
      path: "classes",
      select: "-members",
      populate: [
        {
          path: "school",
          select: "-classes",
        },
      ],
    });
    if (!school) {
      throw new NotFoundErr("school not found");
    }

    res.json({ school });
  } catch (e) {
    next(e);
  }
};
