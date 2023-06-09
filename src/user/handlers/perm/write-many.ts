import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermSet } from "../../models/perm-set";
import { nats } from "../../nats";

export const writeItems: RequestHandler = async (req, res, next) => {
  const data: {
    code: string;
    desc: string;
    grp_id: Types.ObjectId;
  }[] = req.body;

  try {
    const [codes, grpIds] = data
      .reduce(
        (a, { code, grp_id }) => {
          a[0].add(code);
          a[1].add(grp_id);

          return a;
        },
        [new Set(), new Set()]
      )
      .map((s) => Array.from(s));

    if (codes.length < data.length) {
      throw new BadReqErr("duplicate code");
    }

    const [dupl, grpCount] = await Promise.all([
      Perm.exists({
        code: { $in: codes },
      }),
      PermSet.countDocuments({
        _id: { $in: grpIds },
      }),
    ]);
    if (dupl) {
      throw new BadReqErr("duplicate code");
    }
    if (grpCount < grpIds.length) {
      throw new BadReqErr("group mismatch");
    }

    const nItems = await Perm.insertMany(
      data.map(({ code, desc, grp_id }) => ({
        code,
        desc,
        perm_grp: grp_id,
      }))
    );

    res.status(201).json({
      item: await Perm.populate(nItems, {
        path: "perm_grp",
        select: "-perms",
      }),
    });

    await Promise.all([
      Array.from(
        nItems
          .reduce((map, { _id, perm_set: perm_grp }) => {
            const grpStr = perm_grp._id.toString();
            if (!map.has(grpStr)) {
              map.set(grpStr, []);
            }

            map.get(grpStr).push(_id);

            return map;
          }, new Map())
          .entries()
      ).forEach(async ([k, v]) => {
        await PermSet.findByIdAndUpdate(k, {
          $addToSet: {
            items: v,
          },
        });
      }),
      new LogPublisher(nats.cli).publish({
        model: Perm.modelName,
        uid: req.user?.id,
        act: Actions.insert,
        doc: nItems,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
