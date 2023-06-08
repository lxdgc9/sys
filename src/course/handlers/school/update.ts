import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { School } from "../../models/school";

export const updateSchool: RequestHandler = async (req, res, next) => {
  const data: {
    code?: string;
    name?: string;
    addr?: string;
    desc?: string;
  } = req.body;

  try {
    if (!Object.keys(data)) {
      throw new BadReqErr("body not empty");
    }

    const [school, dupl] = await Promise.all([
      School.findById(req.params.id),
      School.exists({
        _id: {
          $ne: req.params.id,
        },
        code: data.code,
      }),
    ]);
    if (!school) {
      throw new BadReqErr("school not found");
    }
    if (data.code && dupl) {
      throw new ConflictErr("duplicate code");
    }

    const updItem = await School.findByIdAndUpdate(
      school._id,
      {
        $set: {
          code: data.code,
          name: data.name,
          addr: data.addr,
          desc: data.desc,
          logo: req.file && `/api/courses/${req.file?.path}`,
        },
      },
      { new: true }
    ).populate({
      path: "classes",
      select: "-school",
    });

    res.json(updItem);
  } catch (e) {
    next(e);
  }
};
