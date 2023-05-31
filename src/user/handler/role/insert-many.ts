import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const insertRoles: RequestHandler = async (req, res, next) => {
  const {
    roles,
  }: {
    roles: {
      name: string;
      level: number;
      permIds: Types.ObjectId[];
    }[];
  } = req.body;

  try {
    // Tập hợp các permission thuộc đầu vào, loại bỏ phần tử trùng
    const permArr = Array.from(new Set(roles.map((r) => r.permIds).flat()));

    // Kiểm tra có permission nào không tồn tại trong db hay không
    const numPerms = await Perm.countDocuments({
      _id: {
        $in: permArr,
      },
    });
    if (numPerms < permArr.length) {
      throw new BadReqErr("permIds mismatch");
    }

    // Tiến hành tạo nhiều role cùng lúc
    const _roles = await Role.insertMany(
      roles.map(({ name, level, permIds }) => ({
        name,
        level,
        perms: Array.from(new Set(permIds)), // đảm bảo permission không bị duplicate
      }))
    );

    // Fetch roles từ documents đã tạo trả về client
    const docs = await Role.find({
      _id: {
        $in: _roles.map((r) => r._id),
      },
    }).populate({
      path: "perms",
      select: "-group",
    });

    res.status(201).json({ roles: docs });

    // Thông báo đến log service
    await new LogPublisher(nats.cli).publish({
      userId: req.user?.id,
      model: Role.modelName,
      act: Actions.insert,
      doc: docs,
    });
  } catch (e) {
    next(e);
  }
};
