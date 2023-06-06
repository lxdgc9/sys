import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { School } from "../../models/school";

export const readItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await School.findById(req.params.id).populate({
      path: "classes",
      select: "-members",
      populate: [
        {
          path: "school",
          select: "-classes",
        },
      ],
    });
    if (!item) {
      throw new NotFoundErr("item not found");
    }

    res.json({ item });
  } catch (e) {
    next(e);
  }
};
