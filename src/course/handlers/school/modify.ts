import { RequestHandler } from "express";
import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const modifySchool: RequestHandler = async (req, res, next) => {
  const {
    code,
    name,
    address,
    description,
  }: {
    code: string | undefined;
    name: string | undefined;
    address: string | undefined;
    description: string | undefined;
  } = req.body;

  try {
    if (
      code === undefined &&
      name === undefined &&
      address === undefined &&
      description === undefined &&
      req.file === undefined
    ) {
      throw new BadReqErr("Missing fields");
    }

    const [hasSchool, hasCode] = await Promise.all([
      School.exists({ _id: req.params.id }),
      School.exists({
        $and: [
          {
            _id: { $ne: req.params.id },
          },
          { code },
        ],
      }),
    ]);
    if (!hasSchool) {
      throw new BadReqErr("School not found");
    }
    if (code && hasCode) {
      throw new ConflictErr("Code already exists");
    }

    const school = await School.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          code,
          name,
          address: address,
          description: description,
          logo_url: req.file && `/api/courses/${req.file?.path}`,
        },
      },
      { new: true }
    )
      .lean()
      .populate({
        path: "classes",
        select: "-school",
      });
    res.json(school);
  } catch (e) {
    next(e);
  }
};

export default modifySchool;
