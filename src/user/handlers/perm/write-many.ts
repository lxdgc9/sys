import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGrp } from "../../models/perm-gr";
import { nats } from "../../nats";

export const writeItems: RequestHandler = async (req, res, next) => {
  const items: {
    code: string;
    desc: string;
    grp_id: Types.ObjectId;
  }[] = req.body;

  try {
    const [_code, _grpId] = items
      .reduce(
        (a, { code, grp_id: grpId }) => {
          a[0].add(code);
          a[1].add(grpId);

          return a;
        },
        [new Set(), new Set()]
      )
      .map((set) => Array.from(set));

    if (_code.length < items.length) {
      throw new BadReqErr("duplicate code");
    }

    const [dupl, grpCount] = await Promise.all([
      Perm.exists({
        code: { $in: _code },
      }),
      PermGrp.countDocuments({
        _id: { $in: _grpId },
      }),
    ]);
    if (dupl) {
      throw new BadReqErr("duplicate code");
    }
    if (grpCount < _grpId.length) {
      throw new BadReqErr("group mismatch");
    }

    const newItems = await Perm.insertMany(
      items.map(({ code, desc, grp_id: grpId }) => ({
        code,
        desc,
        perm_grp: grpId,
      }))
    );

    res.status(201).json({
      perm: await Perm.populate(newItems, {
        path: "perm_grp",
        select: "-perms",
      }),
    });

    await Promise.all([
      Array.from(
        newItems
          .reduce((map, { _id, perm_grp: permGrp }) => {
            const grpStr = permGrp._id.toString();
            if (!map.has(grpStr)) {
              map.set(grpStr, []);
            }

            map.get(grpStr).push(_id);

            return map;
          }, new Map())
          .entries()
      ).forEach(async ([k, v]) => {
        await PermGrp.findByIdAndUpdate(k, {
          $addToSet: {
            perms: v,
          },
        });
      }),
      new LogPublisher(nats.cli).publish({
        model: Perm.modelName,
        uid: req.user?.id,
        act: Actions.insert,
        doc: newItems,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
