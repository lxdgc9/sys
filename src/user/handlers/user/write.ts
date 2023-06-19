import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { InsertUserPublisher } from "../../events/publisher/user/insert";
import { Role } from "../../models/role";
import { User } from "../../models/user";
import { Rule } from "../../models/rule";

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
      throw new ConflictErr("Duplicate uniq fields: username, phone or email");
    }
    if (!hasRole) {
      throw new NotFoundErr("Role not found");
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

    await User.populate(nUser, {
      path: "role",
      populate: {
        path: "rules",
        select: "-catalog",
      },
    });
    res.status(201).json(nUser);

    await Promise.allSettled([
      new InsertUserPublisher(nats.cli).publish(nUser),
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
