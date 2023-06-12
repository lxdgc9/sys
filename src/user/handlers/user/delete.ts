import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { DeleteUserPublisher } from "../../events/publisher/user/delete";
import { User } from "../../models/user";

const delUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new BadReqErr("User not found");
    }

    res.sendStatus(204);

    await User.populate(user, {
      path: "role",
      populate: {
        path: "perms",
        select: "-perm_grp",
      },
    });

    const deleteUserPublisher = new DeleteUserPublisher(nats.cli);
    const logPublisher = new LogPublisher(nats.cli);
    await Promise.allSettled([
      deleteUserPublisher.publish(user._id),
      logPublisher.publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "delete",
        doc: await User.populate(user, {
          path: "role",
          populate: {
            path: "perms",
            select: "-perm_grp",
          },
        }),
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default delUser;
