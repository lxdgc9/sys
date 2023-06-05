import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../../models/class";
import { User } from "../../../models/user";

export const delItem: RequestHandler = async (req, res, next) => {
  try {
    const item = await Class.findByIdAndDelete(req.params.id);
    if (!item) {
      throw new BadReqErr("item not found");
    }

    res.json({ msg: "ok" });

    await User.updateMany(
      {
        classes: { $in: item._id },
      },
      {
        $pull: {
          classes: item._id,
        },
      }
    );
  } catch (e) {
    next(e);
  }
};
