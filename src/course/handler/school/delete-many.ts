import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { Types } from "mongoose";
import { School } from "../../models/school";

export const deleteSchools: RequestHandler = async (req, res, next) => {
  const {
    ids,
  }: {
    ids: Types.ObjectId[];
  } = req.body;

  try {
    // Lọc bỏ phần tử trùng
    const idArr = Array.from(new Set(ids));

    // Kiểm tra có phần tử trong mảng không nằm trong db hay không?
    const schools = await School.find({
      _id: {
        $in: idArr,
      },
    });
    if (schools.length < idArr.length) {
      throw new BadReqErr("ids mismatch");
    }

    await School.deleteMany({
      _id: {
        $in: idArr,
      },
    });

    res.json({ msg: "deleted" });

    // Xóa logo đã lưu khỏi hệ thống
    schools.forEach(({ logo }) => {
      if (logo) {
        rmSync(logo.replace("/api/courses/", ""));
      }
    });
  } catch (e) {
    next(e);
  }
};
