import { RequestHandler } from "express";
import { BadReqErr, ConflictErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
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
    if (!code && !name && !info && !req.file) {
      throw new BadReqErr("Thiếu trường để  cập nhật");
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
      throw new NotFoundErr("Trường học không tồn tại");
    }
    if (code && hasCode) {
      throw new ConflictErr("Mã trường đã tồn tại");
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
    )
      .lean()
      .populate("classes", "-school");
    res.json(school);
  } catch (e) {
    next(e);
  }
};

export default modifySchool;
