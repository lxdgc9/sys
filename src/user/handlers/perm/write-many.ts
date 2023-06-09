import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGroup } from "../../models/perm-group";
import { nats } from "../../nats";

export const writeItems: RequestHandler = async (req, res, next) => {
  const items: {
    code: string;
    info: string;
    perm_group_id: Types.ObjectId;
  }[] = req.body;

  try {
    const [codes, permSetIds] = items
      .reduce(
        (a, item) => {
          a[0].add(item.code);
          a[1].add(item.perm_group_id);
          return a;
        },
        [new Set(), new Set()]
      )
      .map((set) => Array.from(set));

    if (codes.length < items.length) {
      throw new BadReqErr("code already exist");
    }

    const [dupl, numPermSets] = await Promise.all([
      Perm.exists({
        code: { $in: codes },
      }),
      PermGroup.countDocuments({
        _id: { $in: permSetIds },
      }),
    ]);
    if (dupl) {
      throw new BadReqErr("code already exist");
    }
    if (numPermSets < permSetIds.length) {
      throw new BadReqErr("perm_set_id mismatch");
    }

    const perms = await Perm.insertMany(
      items.map(({ code, info, perm_group_id: perm_set_id }) => ({
        code,
        info,
        perm_set: perm_set_id,
      }))
    );

    await Perm.populate(perms, {
      path: "perm_set",
      select: "-items",
    });

    res.status(201).json(perms);

    await Promise.allSettled([
      Array.from(
        perms
          .reduce((map, perm) => {
            const key = perm.perm_group._id.toString();
            if (!map.has(key)) {
              map.set(key, []);
            }
            map.get(key).push(perm._id);

            return map;
          }, new Map())
          .entries()
      ).forEach(async ([k, v]) => {
        await PermGroup.findByIdAndUpdate(k, {
          $addToSet: {
            items: v,
          },
        });
      }),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Perm.modelName,
        action: "insert",
        doc: perms,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
