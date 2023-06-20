import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Class } from "../../models/class";
import { School } from "../../models/school";

const deleteClass: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findById(req.params.id);
    if (!_class) {
      throw new BadReqErr("Class not found");
    }
    if (_class.members.length > 0) {
      throw new BadReqErr("Found dependent");
    }

    await _class.deleteOne();
    res.sendStatus(204);

    await School.updateOne(
      { _id: _class.school },
      {
        $pull: {
          classes: _class._id,
        },
      }
    );
  } catch (e) {
    next(e);
  }
};

export default deleteClass;
