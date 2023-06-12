import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGroup } from "../../models/perm-group";

const writePerms: RequestHandler = async (req, res, next) => {
  const perms: {
    code: string;
    info: string;
    perm_group_id: Types.ObjectId;
  }[] = req.body;

  try {
    const [codes, groupIds] = perms
      .reduce(
        (a, item) => {
          a[0].add(item.code);
          a[1].add(item.perm_group_id);

          return a;
        },
        [new Set(), new Set()]
      )
      .map((set) => [...set]);

    if (codes.length < perms.length) {
      throw new BadReqErr("Code already exist");
    }

    const [dupl, numGroups] = await Promise.all([
      Perm.exists({
        code: { $in: codes },
      }),
      PermGroup.countDocuments({
        _id: { $in: groupIds },
      }),
    ]);
    if (dupl) {
      throw new BadReqErr("Code already exist");
    }
    if (numGroups < groupIds.length) {
      throw new BadReqErr("Group mismatch");
    }

    const nPerms = await Perm.insertMany(
      perms.map((p) => ({
        code: p.code,
        info: p.info,
        perm_group: p.perm_group_id,
      }))
    );
    await Perm.populate(nPerms, {
      path: "perm_group",
      select: "-items",
    });
    res.status(201).json(nPerms);

    await Promise.allSettled([
      [
        ...nPerms
          .reduce((map, perm) => {
            const k = perm.perm_group._id.toString();
            if (!map.has(k)) {
              map.set(k, []);
            }
            map.get(k).push(perm._id);

            return map;
          }, new Map())
          .entries(),
      ].forEach(async ([k, v]) => {
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
        doc: nPerms,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writePerms;
