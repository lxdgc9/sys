import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Catalog } from "../../models/rule-catalog";

const modifyCatalog: RequestHandler = async (req, res, next) => {
  const { name }: { name: string } = req.body;

  try {
    const catalog = await Catalog.findByIdAndUpdate(
      req.params.id,
      {
        $set: { name },
      },
      { new: true }
    )
      .lean()
      .populate("rules");
    if (!catalog) {
      throw new NotFoundErr("Catalog not found");
    }

    res.json(catalog);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Catalog.modelName,
      action: "update",
      data: catalog,
    });
  } catch (e) {
    next(e);
  }
};

export default modifyCatalog;
