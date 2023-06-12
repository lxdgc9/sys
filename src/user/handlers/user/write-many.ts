import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { InsertManyUserPublisher } from "../../events/publisher/user/insert-many";
import { Role } from "../../models/role";
import { User } from "../../models/user";
import { nats } from "../../nats";

export const writeItems: RequestHandler = async (req, res, next) => {
  const items: {
    prof: object & {
      username: string;
      phone: string;
      email: string;
    };
    passwd: string;
    role_id: Types.ObjectId;
    is_active?: boolean;
  }[] = req.body;

  try {
    const [usrnames, phones, emails, rolesIds] = items
      .reduce(
        (a, { prof: { username, phone, email }, role_id: roleId }) => {
          a[0].add(username);
          a[1].add(phone);
          a[2].add(email);
          a[3].add(roleId);

          return a;
        },
        [new Set(), new Set(), new Set(), new Set()]
      )
      .map((set) => Array.from(set));
    if (
      usrnames.length < items.length ||
      phones.length < items.length ||
      emails.length < items.length
    ) {
      throw new ConflictErr("duplicate fields");
    }

    const [dupl, roleCount] = await Promise.all([
      User.exists({
        $or: [
          {
            attrs: {
              $elemMatch: {
                k: "username",
                v: usrnames,
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
        _id: { $in: rolesIds },
      }),
    ]);
    if (dupl) {
      throw new ConflictErr("duplicate fields");
    }
    if (roleCount < rolesIds.length) {
      throw new BadReqErr("role mismatch");
    }

    const newItems = await User.insertMany(
      items.map(({ prof, passwd, role_id: roleId, is_active: isActive }) => ({
        attrs: Object.entries(prof).map(([k, v]) => ({
          k,
          v,
        })),
        passwd,
        role: roleId,
        active: isActive,
      }))
    );

    res.status(201).json({
      users: await User.populate(newItems, {
        path: "role",
        select: "-perms",
      }),
    });

    await Promise.all([
      new InsertManyUserPublisher(nats.cli).publish(newItems),
      new LogPublisher(nats.cli).publish({
        model: User.modelName,
        user_id: req.user?.id,
        action: "insert",
        doc: newItems,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
