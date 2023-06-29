import { RouteHandlerMethod } from "fastify";
import { permissionGroups } from "../../data";

const readPermissionGroup: RouteHandlerMethod = (req, rep) => {
  const { id } = req.params as { id: number };

  try {
    const permission = permissionGroups.find((el) => el.id === +id);
    if (!permission) {
      return rep.status(404).send({
        msg: "Permission group not found",
      });
    }

    rep.code(200).send(permission);
  } catch (e) {}
};

export default readPermissionGroup;
