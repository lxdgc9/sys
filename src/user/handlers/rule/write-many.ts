import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";

const writeRules: RequestHandler = async (req, res, next) => {
  const rules: {
    code: string;
    info: string;
    catalog_id: Types.ObjectId;
  }[] = req.body;

  try {
    const [codes, catalogIds] = rules
      .reduce(
        (a, item) => {
          a[0].add(item.code);
          a[1].add(item.catalog_id);
          return a;
        },
        [new Set(), new Set()]
      )
      .map((s) => [...s]);
    if (codes.length < rules.length) {
      throw new BadReqErr("Xuất hiện code trùng lặp");
    }

    const [hasRule, numCatalogs] = await Promise.all([
      Rule.exists({ code: { $in: codes } }),
      Catalog.countDocuments({ _id: { $in: catalogIds } }),
    ]);
    if (hasRule) {
      throw new BadReqErr("Tồn tại code đã sử dụng");
    }
    if (numCatalogs < catalogIds.length) {
      throw new BadReqErr("Tồn tại catalog_id không hợp lệ");
    }

    const nRules = await Rule.insertMany(
      rules.map(({ code, info, catalog_id }) => ({
        code,
        info,
        catalog: catalog_id,
      }))
    );

    await Rule.populate(nRules, {
      path: "catalog",
      select: "-rules",
    });
    res.status(201).json(nRules);

    await Promise.allSettled([
      Promise.all(
        [
          ...nRules
            .reduce((m, rule) => {
              const k = rule.catalog._id.toString();
              if (!m.has(k)) {
                m.set(k, []);
              }

              m.get(k).push(rule._id);
              return m;
            }, new Map())
            .entries(),
        ].map(([k, v]) => {
          Catalog.updateOne(
            { _id: k },
            {
              $addToSet: {
                rules: v,
              },
            }
          );
        })
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Rule.modelName,
        action: "insert",
        data: nRules,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writeRules;
