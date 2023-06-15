import { RequestHandler } from "express";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Catalog } from "../../models/rule-catalog";

const writeCatalogs: RequestHandler = async (req, res, next) => {
  const catalogs: { name: string }[] = req.body;

  try {
    const nCatalogs = await Catalog.insertMany(catalogs);
    res.status(201).json(nCatalogs);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Catalog.modelName,
      action: "insert",
      data: nCatalogs,
    });
  } catch (e) {
    next(e);
  }
};

export default writeCatalogs;
