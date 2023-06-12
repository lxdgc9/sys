import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { InsertUserPublisher } from "../../events/publisher/user/insert";
import { Role } from "../../models/role";
import { User } from "../../models/user";

const writeUser: RequestHandler = async (req, res, next) => {
  const {
    prof,
    password,
    role_id,
    is_active,
  }: {
    prof: object & {
      username: string;
      phone: string;
      email: string;
    };
    password: string;
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
      Role.exists({ _id: role_id }),
    ]);
    if (dupl) {
      throw new ConflictErr("Duplicate username, phone or email");
    }
    if (!exstRole) {
      throw new BadReqErr("Role not found");
    }

    const newUser = new User({
      attrs: Object.entries(prof).map(([k, v]) => ({
        k,
        v,
      })),
      password,
      role: role_id,
      active: is_active,
    });
    await newUser.save();

    await User.populate(newUser, {
      path: "role",
      populate: {
        path: "perms",
        select: "-perm_grp",
      },
    });

    res.status(201).json(newUser);

    await Promise.allSettled([
      new InsertUserPublisher(nats.cli).publish(newUser),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "insert",
        doc: newUser,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writeUser;
