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
    const [usernames, phones, emails] = users.reduce(
      (
        a: [string[], string[], string[]],
        { prof: { username, phone, email } }
      ) => {
        a[0].push(username);
        a[1].push(phone);
        a[2].push(email);

        return a;
      },
      [[], [], []]
    );
    if (
      new Set(usernames).size < users.length ||
      new Set(phones).size < users.length ||
      new Set(emails).size < users.length
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
                v: usernames,
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "phone",
                v: phones,
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "email",
                v: emails,
              },
            },
          },
        ],
      }),
      Role.countDocuments({
        _id: users.map((u) => u.roleId),
      }),
    ]);
    if (isDupl) {
      throw new ConflictErr("duplicate fields");
    }
    if (numRoles < new Set(users.map((u) => u.roleId)).size) {
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
