import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../../event/publisher/log";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const deleteGroups: RequestHandler = async (req, res, next) => {
  const {
    ids,
  }: {
    ids: Types.ObjectId[];
  } = req.body;

  try {
    // Loại bỏ phần tử trùng trong ids
    const idArr = Array.from(new Set(ids));

    // Kiểm tra có phần tử nào trong mảng không tồn tại trong db hay không
    const groups = await PermGr.find({
      _id: {
        $in: idArr,
      },
    });
    if (groups.length < ids.length) {
      throw new BadReqErr("ids mismatch");
    }

    await PermGr.deleteMany({
      _id: {
        $in: idArr,
      },
    });

    res.json({ msg: "deleted" });

    await Promise.all([
      // Xóa các permission nếu có sử dụng group này
      Perm.deleteMany({
        group: {
          $in: idArr,
        },
      }),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: PermGr.modelName,
        act: Actions.delete,
        doc: groups,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
