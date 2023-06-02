import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { School } from "../../../model/school";
import { User } from "../../../model/user";

export const deleteClasses: RequestHandler = async (req, res, next) => {
  const {
    ids,
  }: {
    ids: Types.ObjectId[];
  } = req.body;

  try {
    // Loại bỏ phần tử trùng
    const idsArr = Array.from(new Set(ids));

    const numClasses = await Class.countDocuments({
      _id: {
        $in: idsArr,
      },
    });
    if (numClasses < idsArr.length) {
      throw new BadReqErr("ids mismatch");
    }

    const startTime = process.hrtime();

    await Class.deleteMany({
      _id: {
        $in: idsArr,
      },
    });

    const endTime = process.hrtime(startTime);
    const processingTime = endTime[0] * 1000 + endTime[1] / 1000000;
    console.log(`Thời gian xử lý: ${processingTime} ms`);

    res.json({ msg: "deleted" });

    // Cập nhật xóa các lớp này ra khỏi document
    await Promise.all([
      School.updateMany(
        {
          classes: {
            $in: idsArr,
          },
        },
        {
          $pullAll: {
            classes: idsArr,
          },
        }
      ),
      User.updateMany(
        {
          classes: {
            $in: idsArr,
          },
        },
        {
          $pullAll: {
            classes: idsArr,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};
