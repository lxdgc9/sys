import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const insertRole: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    permIds,
  }: {
    name: string;
    level: number;
    permIds: Types.ObjectId[];
  } = req.body;

  try {
    // Danh sách permission không bị duplicate
    const permArr = Array.from(new Set(permIds));

    // Kiểm tra có permission nào không tồn tại trong db hay không?
    const numPerms = await Perm.countDocuments({
      _id: {
        $in: permArr,
      },
    });
    if (numPerms < permArr.length) {
      throw new BadReqErr("permIds mismatch");
    }

    // Tiến hành tạo role
    const newRole = new Role({
      name,
      level,
      perms: permArr, // danh sách này đã lược bỏ duplicate trước đó
    });
    await newRole.save();

    // Fetch data trả về client
    const role = await Role.findById(newRole._id).populate({
      path: "perms",
      select: "-group",
    });

    res.json({ role });

    // Thông báo đến log service
    await new LogPublisher(nats.cli).publish({
      userId: req.user?.id,
      model: Role.modelName,
      act: Actions.insert,
      doc: role,
    });
  } catch (e) {
    next(e);
  }
};
