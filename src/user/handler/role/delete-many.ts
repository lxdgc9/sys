import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const deleteRoles: RequestHandler = async (req, res, next) => {
  const {
    ids,
  }: {
    ids: Types.ObjectId[];
  } = req.body;

  try {
    // Rất có thể ids sẽ chứa phần tử trùng nhau, đoạn này để thanh lọc
    const idArr = Array.from(new Set(ids));

    // Kiểm tra danh sách role có phần tử nào không tồn tại trong db hay không
    const roles = await Role.find({
      _id: {
        $in: idArr,
      },
    }).populate({
      path: "perms",
      select: "-group",
    });
    if (roles.length < idArr.length) {
      throw new BadReqErr("ids mismatch");
    }

    // Tiến hành xóa những role có id thuộc mảng đã thanh lọc trước đó
    await Role.deleteMany({
      _id: {
        $in: idArr,
      },
    });

    res.json({ msg: "deleted" });

    // Thông báo đến log service
    await Promise.all([
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Role.modelName,
        act: Actions.delete,
        doc: roles,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
