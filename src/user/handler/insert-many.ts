import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { InsertManyUserPublisher } from "../event/publisher/user/insert-many";
import { Role } from "../model/role";
import { User } from "../model/user";
import { nats } from "../nats";

export const insertUsers: RequestHandler = async (req, res, next) => {
  const {
    users,
  }: {
    users: {
      prof: object & {
        username: string;
        phone: string;
        email: string;
      };
      passwd: string;
      roleId: Types.ObjectId;
      active?: boolean;
    }[];
  } = req.body;

  try {
    const [usernameArr, phoneArr, emailArr, roleArr] = users
      .reduce(
        (a, { prof: { username, phone, email }, roleId }) => {
          a[0].add(username);
          a[1].add(phone);
          a[2].add(email);
          a[3].add(roleId);
          return a;
        },
        [new Set(), new Set(), new Set(), new Set()]
      )
      .map((el) => Array.from(el));
    if (
      usernameArr.length < users.length ||
      phoneArr.length < users.length ||
      emailArr.length < users.length
    ) {
      throw new ConflictErr("duplicate fields");
    }

    const [isDupl, numRoles] = await Promise.all([
      User.exists({
        $or: [
          {
            attrs: {
              $elemMatch: {
                k: "username",
                v: usernameArr,
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "phone",
                v: phoneArr,
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "email",
                v: emailArr,
              },
            },
          },
        ],
      }),
      Role.countDocuments({
        _id: {
          $in: roleArr,
        },
      }),
    ]);
    if (isDupl) {
      throw new ConflictErr("duplicate fields");
    }
    if (numRoles < roleArr.length) {
      throw new BadReqErr("roleIds mismatch");
    }

    const _users = await User.insertMany(
      users.map(({ prof, passwd, roleId, active }) => ({
        attrs: Object.entries(prof).map(([k, v]) => ({
          k,
          v,
        })),
        passwd,
        role: roleId,
        active,
      }))
    );

    const docs = await User.find({
      _id: {
        $in: _users.map((u) => u._id),
      },
    }).populate({
      path: "role",
      select: "-perms",
    });

    res.status(201).json({ users: docs });

    await Promise.all([
      new InsertManyUserPublisher(nats.cli).publish(docs),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: User.modelName,
        act: Actions.insert,
        doc: docs,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
