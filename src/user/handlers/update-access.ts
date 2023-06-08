import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../events/publisher/log";
import { UpdateUserPublisher } from "../events/publisher/user/mod";
import { User } from "../models/user";
import { nats } from "../nats";

export const changeAccess: RequestHandler = async (req, res, next) => {
  const { status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          is_active: status,
        },
      },
      {
        new: true,
        populate: {
          path: "role",
          populate: {
            path: "perms",
            select: "-perm_grp",
          },
        },
      }
    );
    if (!user) {
      throw new BadReqErr("user not found");
    }

    res.json(user);

    const updateUserPublisher = new UpdateUserPublisher(nats.cli);
    const logPublisher = new LogPublisher(nats.cli);

    await Promise.allSettled([
      updateUserPublisher.publish(user),
      logPublisher.publish({
        model: User.modelName,
        uid: req.user?.id,
        act: Actions.update,
        doc: user,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
