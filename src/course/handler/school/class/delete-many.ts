import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../../model/class";
import { School } from "../../../model/school";
import { User } from "../../../model/user";

export const deleteClasses: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findByIdAndDelete(req.params.id);
    if (!_class) {
      throw new BadReqErr("class not found");
    }

    res.json({ msg: "deleted" });

    await Promise.all([
      School.findOneAndUpdate(_class.school, {
        $pull: {
          classes: _class._id,
        },
      }),
      User.deleteMany(
        {
          _id: {
            $in: _class.members,
          },
        },
        {
          $pull: {
            classes: _class._id,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};
