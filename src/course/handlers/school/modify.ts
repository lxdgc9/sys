import { RequestHandler } from "express";
import { ConflictErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const modifySchool: RequestHandler = async (req, res, next) => {
  const {
    code,
    name,
    info,
  }: {
    code?: string;
    name?: string;
    info?: string;
  } = req.body;

  try {
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
      throw new NotFoundErr("School not found");
    }
    if (code && hasCode) {
      throw new ConflictErr("Duplicate code");
    }

    let logo = undefined;
    if (req.file) {
      logo = `/api/courses/${req.file.path}`;
    }

    const school = await School.findByIdAndUpdate(
      req.params.id,
      {
        $set: { code, name, info, logo },
      },
      { new: true }
    ).populate("classes", "-school");
    res.json(school);
  } catch (e) {
    next(e);
  }
};

export default modifySchool;
