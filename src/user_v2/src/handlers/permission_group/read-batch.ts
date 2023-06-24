import { RouteHandlerMethod } from "fastify";
import { permissionGroups } from "../../data";

const readPermissionGroups: RouteHandlerMethod = (req, rep) => {
  try {
    rep.code(200).send(permissionGroups);
  } catch (e) {
  }
}

export default readPermissionGroups;