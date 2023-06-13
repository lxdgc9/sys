import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { UpdateUserPublisher } from "../../events/publisher/user/update";
import { Role } from "../../models/role";
import { User } from "../../models/user";

const updateUser: RequestHandler = async (req, res, next) => {
  const {
    prof,
    role_id,
  }: {
    prof?: object & {
      username: string;
      phone: string;
      email: string;
    };
    role_id?: Types.ObjectId;
  } = req.body;

  try {
    if (prof === undefined && role_id === undefined) {
      throw new BadReqErr("Missing fields");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new BadReqErr("User not found");
    }

    const [dupl, exstRole] = await Promise.all([
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
      Role.exists({ _id: role_id }),
    ]);
    if (prof && dupl) {
      throw new ConflictErr("Duplicate username, phone or email");
    }
    if (role_id && !exstRole) {
      throw new BadReqErr("Role not found");
    }

    const updUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          attrs: Object.entries(prof || {}).map(([k, v]) => ({
            k,
            v,
          })),
          role: role_id,
        },
      },
      { new: true }
    ).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-perm_grp",
      },
    });

    res.json({ user: updUser });

    await User.populate(user, {
      path: "role",
      populate: {
        path: "perms",
        select: "-perm_grp",
      },
    });

    const updateUserPublisher = new UpdateUserPublisher(nats.cli);
    const logPublisher = new LogPublisher(nats.cli);
    await Promise.allSettled([
      updateUserPublisher.publish(updUser!),
      logPublisher.publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "update",
        data: user,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default updateUser;
