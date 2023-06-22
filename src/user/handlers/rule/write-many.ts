import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/catalog";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

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
      throw new BadReqErr("Duplicate code");
    }

    const [hasRule, numCatalogs] = await Promise.all([
      Rule.exists({ code: { $in: codes } }),
      Catalog.countDocuments({ _id: { $in: catalogIds } }),
    ]);
    if (hasRule) {
      throw new BadReqErr("Duplicate code");
    }
    if (numCatalogs < catalogIds.length) {
      throw new BadReqErr("Invalid catalog_id");
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
      await Promise.all(
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
        ].map(async ([k, v]) => {
          await Catalog.updateOne(
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
