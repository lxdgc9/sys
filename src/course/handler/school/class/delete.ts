import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { timer } from "../../../helper/timer";
import { Class } from "../../../model/class";

export const deleteClass: RequestHandler = async (req, res, next) => {
  console.group("Handler: deleteClass");
  const breakPoint01 = timer.breakPoint();

  try {
    const _class = await Class.findById(req.params.id);
    if (!_class) {
      throw new BadReqErr("class not found");
    }
    timer.cal("Check id", breakPoint01);

    const breakPoint02 = timer.breakPoint();
    await _class.deleteOne();
    timer.cal("Handle deleteOne()", breakPoint02);

    res.json({ msg: "deleted" });
  } catch (e) {
    next(e);
  }

  timer.cal("Total", breakPoint01);
  console.groupEnd();
};
