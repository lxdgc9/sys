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
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

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
      new UpdateUserPublisher(nats.cli).publish(updUser!),
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
