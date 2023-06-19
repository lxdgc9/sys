import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Catalog } from "../../models/rule-catalog";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const deleteCatalogs: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const catalogs = await Catalog.find({ _id: { $in: ids } });
    if (catalogs.length < ids.length) {
      throw new BadReqErr("Invalid request");
    }
    if (catalogs.some((el) => el.rules.length > 0)) {
      throw new BadReqErr("Found dependent");
    }

    await Catalog.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Catalog.modelName,
      action: "delete",
      data: catalogs,
    });
  } catch (e) {
    next(e);
  }
};

export default deleteCatalogs;
