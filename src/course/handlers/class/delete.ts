import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../models/class";
import { School } from "../../models/school";

export const delClass: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findById(req.params.id);
    if (!_class) {
      throw new BadReqErr("class not found");
    }
    if (_class.members.length) {
      throw new BadReqErr("found dependent");
    }

    await _class.deleteOne();

    res.sendStatus(204);

    await School.findByIdAndUpdate(_class.school, {
      $pull: {
        classes: _class._id,
      },
    });
  } catch (e) {
    next(e);
  }
};
