import { RequestHandler } from "express";
import { BadReqErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Catalog } from "../../models/rule-catalog";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const deleteCatalog: RequestHandler = async (req, res, next) => {
  try {
    const catalog = await Catalog.findById(req.params.id);
    if (!catalog) {
      throw new NotFoundErr("Catalog not found");
    }
    if (catalog.rules.length > 0) {
      throw new BadReqErr("Found dependent");
    }

    await catalog.deleteOne();
    res.sendStatus(204);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Catalog.modelName,
      action: "delete",
      data: catalog,
    });
  } catch (e) {
    next(e);
  }
};

export default deleteCatalog;
