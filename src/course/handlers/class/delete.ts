import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../models/class";
import { School } from "../../models/school";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await Class.findById(req.params.id);
    if (!item) {
      throw new BadReqErr("item not found");
    }
    if (item.members.length) {
      throw new BadReqErr("found dependent");
    }

    await item.deleteOne();

    res.sendStatus(204);

    await School.findByIdAndUpdate(item.school, {
      $pull: {
        classes: item._id,
      },
    });
  } catch (e) {
    next(e);
  }
};
