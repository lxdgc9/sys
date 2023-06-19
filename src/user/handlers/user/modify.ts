import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Role } from "../../models/role";
import { User } from "../../models/user";
import { Rule } from "../../models/rule";
import { UpdateUserPublisher } from "../../events/publisher/user/update";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const modifyUser: RequestHandler = async (req, res, next) => {
  const {
    prof,
    role_id,
    spec_rule_ids,
  }: {
    prof?: object & {
      username: string;
      phone: string;
      email: string;
    };
    role_id?: Types.ObjectId;
    spec_rule_ids?: Types.ObjectId[];
  } = req.body;

  const specRuleIds = [...new Set(spec_rule_ids)];

  try {
    if (!prof && !role_id && !spec_rule_ids) {
      throw new BadReqErr("Không có trường cần cập nhật");
    }

    const hasUser = await User.exists({ _id: req.params.id });
    if (!hasUser) {
      throw new NotFoundErr("Không tìm thấy user");
    }

    const [dupl, hasRole, numRules] = await Promise.all([
      User.exists({
        $or: [
          {
            _id: { $ne: req.params._id },
            attrs: {
              $elemMatch: {
                k: "username",
                v: prof?.username,
              },
            },
          },
          {
            _id: { $ne: req.params._id },
            attrs: {
              $elemMatch: {
                k: "phone",
                v: prof?.phone,
              },
            },
          },
          {
            _id: { $ne: req.params._id },
            attrs: {
              $elemMatch: {
                k: "email",
                v: prof?.email,
              },
            },
          },
        ],
      }),
      Role.exists({ _id: role_id }),
      Rule.countDocuments({ _id: { $in: specRuleIds } }),
    ]);
    if (prof && dupl) {
      throw new ConflictErr("Duplicate username, phone or email");
    }
    if (role_id && !hasRole) {
      throw new BadReqErr("Role not found");
    }
    if (spec_rule_ids && numRules < specRuleIds.length) {
      throw new BadReqErr("Danh sách quyền hạn không hợp lệ");
    }

    const modUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          attrs: Object.entries(prof || {}).map(([k, v]) => ({
            k,
            v,
          })),
          role: role_id,
          spec_rules: specRuleIds,
        },
      },
      { new: true }
    ).populate({
      path: "role",
      populate: {
        path: "rules",
        select: "-catalog",
      },
    });

    res.json(modUser);

    await Promise.allSettled([
      new UpdateUserPublisher(nats.cli).publish(modUser!),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "update",
        data: modUser,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default modifyUser;
