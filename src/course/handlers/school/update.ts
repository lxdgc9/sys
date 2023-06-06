import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { School } from "../../models/school";

export const updateItem: RequestHandler = async (req, res, next) => {
  const {
    code,
    name,
    addr,
    desc,
  }: {
    code?: string;
    name?: string;
    addr?: string;
    desc?: string;
  } = req.body;

  try {
    if (!Object.keys(req.body)) {
      throw new BadReqErr("body not empty");
    }

    const [school, isDupl] = await Promise.all([
      School.findById(req.params.id),
      School.exists({
        _id: {
          $ne: req.params.id,
        },
        code,
      }),
    ]);
    if (!school) {
      throw new BadReqErr("school not found");
    }
    if (code && isDupl) {
      throw new ConflictErr("duplicate code");
    }

    const updItem = await School.findByIdAndUpdate(
      school._id,
      {
        $set: {
          code,
          name,
          addr,
          desc,
          logo: req.file && `/api/courses/${req.file?.path}`,
        },
      },
      { new: true }
    ).populate({
      path: "classes",
      select: "-school",
    });

    res.json({ school: updItem });
  } catch (e) {
    next(e);
  }
};
