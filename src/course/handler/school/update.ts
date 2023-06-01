import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { School } from "../../model/school";

export const updateSchool: RequestHandler = async (req, res, next) => {
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
    // Thật vô nghĩa nếu req.body = {}
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    // Validate school và duplicate code
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

    // Tiến hành cập nhật school và fetch data trả về client
    const updSchool = await School.findByIdAndUpdate(
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

    res.json({ school: updSchool });

    // Xóa logo cũ khỏi hệ thống
    if (req.file && school.logo) {
      rmSync(school.logo.replace("/api/courses/", ""), {
        force: true,
      });
    }
  } catch (e) {
    next(e);
  }
};
