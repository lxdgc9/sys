import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { UpdateUserPublisher } from "../event/publisher/user/mod";
import { Role } from "../model/role";
import { User } from "../model/user";
import { nats } from "../nats";

export const updateUser: RequestHandler = async (req, res, next) => {
  const {
    prof,
    roleId,
  }: {
    prof?: object & {
      username: string;
      phone: string;
      email: string;
    };
    roleId?: Types.ObjectId;
  } = req.body;

  try {
    // Thật vô nghĩa nếu req.body = {}
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    // Kiểm tra người dùng này có tồn tại trong db hay không
    const user = await User.findById(req.params.id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });
    if (!user) {
      throw new BadReqErr("user not found");
    }

    // Kiêm tra duplicate username, phone, email và có tồn tại role
    // trong db hay không
    const [isDupl, exRole] = await Promise.all([
      User.exists({
        $or: [
          {
            _id: { $ne: user._id },
            attrs: {
              $elemMatch: {
                k: "username",
                v: prof?.username,
              },
            },
          },
          {
            _id: { $ne: user._id },
            attrs: {
              $elemMatch: {
                k: "phone",
                v: prof?.phone,
              },
            },
          },
          {
            _id: { $ne: user._id },
            attrs: {
              $elemMatch: {
                k: "email",
                v: prof?.email,
              },
            },
          },
        ],
      }),
      Role.exists({ _id: roleId }),
    ]);
    if (prof && isDupl) {
      throw new ConflictErr("duplicate username, phone or email");
    }
    if (roleId && !exRole) {
      throw new BadReqErr("role not found");
    }

    // Tiến hành cập nhật và trả về client
    const updUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          attrs: Object.entries(prof || {}).map(([k, v]) => ({
            k,
            v,
          })),
          role: roleId,
        },
      },
      { new: true }
    ).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });

    res.json({ user: updUser });

    await Promise.all([
      // Thông báo đến các service khác
      new UpdateUserPublisher(nats.cli).publish(updUser!),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: User.modelName,
        act: Actions.update,
        doc: user,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
