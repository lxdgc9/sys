import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../events/publisher/log";
import { UpdateUserPublisher } from "../events/publisher/user/mod";
import { Role } from "../models/role";
import { User } from "../models/user";
import { nats } from "../nats";

export const updateItem: RequestHandler = async (req, res, next) => {
  const {
    prof,
    role_id: roleId,
  }: {
    prof?: object & {
      username: string;
      phone: string;
      email: string;
    };
    role_id?: Types.ObjectId;
  } = req.body;

  try {
    if (!Object.keys(req.body).length) {
      throw new BadReqErr("body not empty");
    }

    const item = await User.findById(req.params.id);
    if (!item) {
      throw new BadReqErr("item not found");
    }

    const [dupl, exstRole] = await Promise.all([
      User.exists({
        $or: [
          {
            _id: { $ne: item._id },
            attrs: {
              $elemMatch: {
                k: "username",
                v: prof?.username,
              },
            },
          },
          {
            _id: { $ne: item._id },
            attrs: {
              $elemMatch: {
                k: "phone",
                v: prof?.phone,
              },
            },
          },
          {
            _id: { $ne: item._id },
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
    if (prof && dupl) {
      throw new ConflictErr("duplicate username, phone or email");
    }
    if (roleId && !exstRole) {
      throw new BadReqErr("role not found");
    }

    await item.updateOne({
      $set: {
        attrs: Object.entries(prof || {}).map(([k, v]) => ({
          k,
          v,
        })),
        role: roleId,
      },
    });

    const updItem = await User.findById(item._id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-perm_grp",
      },
    });

    res.json({ user: updItem });

    await Promise.all([
      new UpdateUserPublisher(nats.cli).publish(updItem!),
      new LogPublisher(nats.cli).publish({
        model: User.modelName,
        uid: req.user?.id,
        act: Actions.update,
        doc: await User.populate(item, {
          path: "role",
          populate: {
            path: "perms",
            select: "-perm_grp",
          },
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
