import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../../model/class";
import { School } from "../../../model/school";
import { User } from "../../../model/user";

export const deleteClass: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findByIdAndDelete(req.params.id);
    if (!_class) {
      throw new BadReqErr("class not found");
    }

    res.json({ msg: "deleted" });

    // Loại bỏ lớp đã xóa ra khỏi document
    await Promise.all([
      School.updateMany(
        {
          classes: {
            $in: _class._id,
          },
        },
        {
          $pull: {
            classes: _class._id,
          },
        }
      ),
      User.updateMany(
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
