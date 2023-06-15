import { RequestHandler } from "express";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Catalog } from "../../models/rule-catalog";

const writeCatalog: RequestHandler = async (req, res, next) => {
  const { name }: { name: string } = req.body;

  try {
    const catalog = new Catalog({ name });
    await catalog.save();

    res.status(201).json(catalog);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Catalog.modelName,
      action: "insert",
      data: catalog,
    });
  } catch (e) {
    next(e);
  }
};

export default writeCatalog;
