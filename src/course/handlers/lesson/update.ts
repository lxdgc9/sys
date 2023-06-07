import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Lesson } from "../../models/lesson";

export const updateItem: RequestHandler = async (req, res, next) => {
  const item: {
    title: string;
    content: string;
  } = req.body;

  if (req.files) {
  } else {
  }

  try {
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    const item = await Lesson.findById(req.params.id);
    if (!item) {
      throw new BadReqErr("item not found");
    }

    res.json({});
  } catch (e) {
    next(e);
  }
};
