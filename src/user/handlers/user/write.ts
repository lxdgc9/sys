import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Role } from "../../models/role";
import { User } from "../../models/user";
import { Rule } from "../../models/rule";
import { InsertUserPublisher } from "../../events/publisher/user/insert";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const writeUser: RequestHandler = async (req, res, next) => {
  const {
    prof,
    password,
    role_id,
    spec_rule_ids,
    is_active,
  }: {
    prof: object & { username: string; phone: string; email: string };
    password: string;
    role_id: Types.ObjectId;
    spec_rule_ids?: Types.ObjectId[];
    is_active?: boolean;
  } = req.body;

  try {
    const [isDupl, hasRole, numRules] = await Promise.all([
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
      Rule.countDocuments({ _id: { $in: spec_rule_ids } }),
    ]);
    if (isDupl) {
      throw new ConflictErr("Duplicate username, phone or email");
    }
    if (!hasRole) {
      throw new NotFoundErr("role_id not found");
    }
    if (spec_rule_ids && numRules < spec_rule_ids.length) {
      throw new BadReqErr("Invalid spec_rule_ids");
    }

    const nUser = new User({
      attrs: Object.entries(prof).map(([k, v]) => ({
        k,
        v,
      })),
      password,
      role: role_id,
      spec_rules: spec_rule_ids,
      active: is_active,
    });
    await nUser.save();

    const _user = await User.populate<{
      role: {
        name: string;
        rules: { code: string }[];
      };
      spec_rules: { code: string }[];
    }>(nUser, [
      {
        path: "role",
        populate: {
          path: "rules",
          select: "-catalog",
        },
      },
      {
        path: "spec_rules",
        select: "-catalog",
      },
    ]);
    res.status(201).json(nUser);

    await Promise.allSettled([
      new InsertUserPublisher(nats.cli).publish({
        id: _user._id,
        attrs: _user.attrs,
        role: _user.role.name,
        rules: [
          ...new Set(
            _user.role.rules
              .map((el) => el.code)
              .concat(_user.spec_rules.map((el) => el.code))
          ),
        ],
        is_active: _user.is_active,
      }),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "insert",
        data: nUser,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writeUser;
