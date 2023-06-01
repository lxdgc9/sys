import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { InsertUserPublisher } from "../event/publisher/user/insert";
import { Role } from "../model/role";
import { User } from "../model/user";
import { nats } from "../nats";

export const insertUser: RequestHandler = async (req, res, next) => {
  const {
    prof,
    passwd,
    roleId,
    active,
  }: {
    prof: object & {
      username: string;
      phone: string;
      email: string;
    };
    passwd: string;
    roleId: Types.ObjectId;
    active?: boolean;
  } = req.body;

  try {
    // Validate duplicate các username, phone, email và có tồn tại
    // role hay không?
    const [isDupl, exRole] = await Promise.all([
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
    if (isDupl) {
      throw new ConflictErr("duplicate username, phone or email");
    }
    if (!exRole) {
      throw new BadReqErr("role not found");
    }

    // Tạo user vào db
    const newUser = new User({
      attrs: Object.entries(prof).map(([k, v]) => ({
        k,
        v,
      })),
      passwd,
      role: roleId,
      active,
    });
    await newUser.save();

    // Fetch data đã tạo trả về client
    const user = await User.findById(newUser._id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });

    res.status(201).json({ user });

    await Promise.all([
      new InsertUserPublisher(nats.cli).publish(user!),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: User.modelName,
        act: Actions.insert,
        doc: user,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};