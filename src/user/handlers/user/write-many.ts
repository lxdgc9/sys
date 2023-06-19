import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { Role } from "../../models/role";
import { User } from "../../models/user";
import { InsertManyUserPublisher } from "../../events/publisher/user/insert-many";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const writeUsers: RequestHandler = async (req, res, next) => {
  const users: {
    prof: object & { username: string; phone: string; email: string };
    password: string;
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
      .map((s) => [...s]);
    if (
      usernames.length < users.length ||
      phones.length < users.length ||
      emails.length < users.length
    ) {
      throw new ConflictErr("Duplicate uniq fields: username, phone or email");
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
        _id: { $in: roleIds },
      }),
    ]);
    if (isDupl) {
      throw new ConflictErr("Duplicate fields");
    }
    if (numRoles < roleIds.length) {
      throw new BadReqErr("Role mismatch");
    }

    const nUsers = await User.insertMany(
      users.map(({ prof, password, role_id, is_active }) => ({
        attrs: Object.entries(prof).map(([k, v]) => ({
          k,
          v,
        })),
        password,
        role: role_id,
        active: is_active,
      }))
    );

    const _users = await User.populate<{
      role: {
        name: string;
        rules: { code: string }[];
      };
      spec_rules: { code: string }[];
      is_active: boolean;
    }>(nUsers, [
      { path: "role", select: "-rules" },
      { path: "spec_rules", select: "-catalog" },
    ]);
    res.status(201).json(nUsers);

    await Promise.all([
      new InsertManyUserPublisher(nats.cli).publish(
        _users.map((user) => ({
          id: user._id,
          attrs: user.attrs,
          role: user.role.name,
          rules: [
            ...new Set(
              user.role.rules
                .map((el) => el.code)
                .concat(user.spec_rules.map((el) => el.code))
            ),
          ],
          is_active: user.is_active,
        }))
      ),
      new LogPublisher(nats.cli).publish({
        model: User.modelName,
        user_id: req.user?.id,
        action: "insert",
        data: nUsers,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writeUsers;
