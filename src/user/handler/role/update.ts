import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const updateRole: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    permIds,
  }: {
    name?: string;
    level?: number;
    permIds?: Types.ObjectId[];
  } = req.body;

  try {
    // Thật vô nghĩa nếu req.body = {}
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    // Danh sách permission đã loại bỏ duplicate
    const permArr = Array.from(new Set(permIds));

    const [role, numPerms] = await Promise.all([
      Role.findById(req.params.id).populate({
        path: "perms",
        select: "-group",
      }),
      Perm.countDocuments({
        _id: {
          $in: permArr,
        },
      }),
    ]);
    if (!role) {
      throw new BadReqErr("role not found");
    }
    if (permIds && numPerms < permArr.length) {
      throw new BadReqErr("permIds mismatch");
    }

    // Cập nhật role và fetch data trả về client
    const updRole = await Role.findByIdAndUpdate(
      req.params.id,
      {
        $set: permIds
          ? {
              name,
              level,
              perms: permArr,
            }
          : {
              name,
              level,
            },
      },
      { new: true }
    ).populate({
      path: "perms",
      select: "-group",
    });

    res.json({ role: updRole });

    // Thông báo đến log service
    await new LogPublisher(nats.cli).publish({
      userId: req.user?.id,
      model: Role.modelName,
      act: Actions.update,
      doc: role,
    });
  } catch (e) {
    next(e);
  }
};
