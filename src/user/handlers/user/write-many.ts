import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { InsertManyUserPublisher } from "../../events/publisher/user/insert-many";
import { Role } from "../../models/role";
import { User } from "../../models/user";

const writeUsers: RequestHandler = async (req, res, next) => {
  const users: {
    prof: object & {
      username: string;
      phone: string;
      email: string;
    };
    passwd: string;
    role_id: Types.ObjectId;
    spec_rule_ids?: Types.ObjectId[];
    is_active?: boolean;
  }[] = req.body;

  try {
    const [usernames, phones, emails, roleIds] = users
      .reduce(
        (a, { prof: { username, phone, email }, role_id }) => {
          a[0].add(username);
          a[1].add(phone);
          a[2].add(email);
          a[3].add(role_id);

          return a;
        },
        [new Set(), new Set(), new Set(), new Set()]
      )
      .map((set) => [...set]);
    if (
      usernames.length < users.length ||
      phones.length < users.length ||
      emails.length < users.length
    ) {
      throw new ConflictErr("Duplicate fields");
    }

    const [dupl, numRoles] = await Promise.all([
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
        _id: { $in: roleIds },
      }),
    ]);
    if (dupl) {
      throw new ConflictErr("Duplicate fields");
    }
    if (numRoles < roleIds.length) {
      throw new BadReqErr("Role mismatch");
    }

    const newUsers = await User.insertMany(
      users.map(({ prof, passwd, role_id: roleId, is_active: isActive }) => ({
        attrs: Object.entries(prof).map(([k, v]) => ({
          k,
          v,
        })),
        passwd,
        role: roleId,
        active: isActive,
      }))
    );

    await User.populate(newUsers, [
      {
        path: "role",
        select: "-perms",
      },
      {
        path: "spec_rules",
        select: "-catalog",
      },
    ]);
    res.status(201).json(newUsers);

    await Promise.all([
      new InsertManyUserPublisher(nats.cli).publish(newUsers),
      new LogPublisher(nats.cli).publish({
        model: User.modelName,
        user_id: req.user?.id,
        action: "insert",
        data: newUsers,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writeUsers;
