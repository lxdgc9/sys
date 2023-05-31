import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const deletePerms: RequestHandler = async (req, res, next) => {
  const {
    ids,
  }: {
    ids: Types.ObjectId[];
  } = req.body;

  try {
    // Danh sách id đã lượt bỏ trùng
    const idArr = Array.from(new Set(ids));

    const perms = await Perm.find({
      _id: {
        $in: idArr,
      },
    }).populate({
      path: "group",
      select: "-perms",
    });
    // Kiểm tra có permission nào không tồn tại trong db hay không
    if (perms.length < idArr.length) {
      throw new BadReqErr("ids mismatch");
    }

    // Tiến hành xóa permissions
    await Perm.deleteMany({
      _id: {
        $in: idArr,
      },
    });

    res.json({ msg: "deleted" });

    await Promise.all([
      // Tìm kiếm các group chứa permission đã xóa và cập nhật loại
      // bỏ chúng ra khỏi property perms
      PermGr.updateMany(
        {
          _id: {
            $in: perms.map((p) => p.group._id),
          },
        },
        {
          $pullAll: {
            perms: idArr,
          },
        }
      ),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Perm.modelName,
        act: Actions.delete,
        doc: perms,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
