import { RequestHandler } from "express";
import { Class } from "../../../models/class";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";

const readClassBySchool: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findById(req.params.school_id).populate([
      {
        path: "school",
        select: "-classes",
      },
      {
        path: "members",
        select: "-classes",
      },
    ]);
    if (!_class) {
      throw new BadReqErr("Class not found");
    }

    res.json(_class);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export default readClassBySchool;
