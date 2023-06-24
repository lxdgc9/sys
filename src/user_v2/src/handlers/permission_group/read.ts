import { RouteHandlerMethod } from "fastify";
import { permissionGroups } from "../../data";

const readPermissionGroup: RouteHandlerMethod = (req, rep) => {
  const { id } = req.params as { id: number };

  try {
    const permission = permissionGroups.find((el) => el.id === id);
    rep.code(200).send(permission);
  } catch (e) {}
};

export default readPermissionGroup;
