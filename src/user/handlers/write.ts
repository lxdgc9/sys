import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../events/publisher/log";
import { InsertUserPublisher } from "../events/publisher/user/insert";
import { Role } from "../models/role";
import { User } from "../models/user";
import { nats } from "../nats";

export const writeItem: RequestHandler = async (req, res, next) => {
  const {
    prof,
    passwd,
    role_id: roleId,
    is_active: isActive,
  }: {
    prof: object & {
      username: string;
      phone: string;
      email: string;
    };
    passwd: string;
    role_id: Types.ObjectId;
    is_active?: boolean;
  } = req.body;

  try {
    const [dupl, exstRole] = await Promise.all([
      User.exists({
        $or: [
          {
            attrs: {
              $elemMatch: {
                k: "username",
                v: prof.username,
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "phone",
                v: prof.phone,
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "email",
                v: prof.email,
              },
            },
          },
        ],
      }),
      Role.exists({ _id: roleId }),
    ]);
    if (dupl) {
      throw new ConflictErr("duplicate username, phone or email");
    }
    if (!exstRole) {
      throw new BadReqErr("role not found");
    }

    const newItem = new User({
      attrs: Object.entries(prof).map(([k, v]) => ({
        k,
        v,
      })),
      passwd,
      role: roleId,
      active: isActive,
    });
    await newItem.save();

    res.status(201).json({
      user: await User.populate(newItem, {
        path: "role",
        populate: {
          path: "perms",
          select: "-perm_grp",
        },
      }),
    });

    await Promise.all([
      new InsertUserPublisher(nats.cli).publish(newItem),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "insert",
        doc: newItem,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
