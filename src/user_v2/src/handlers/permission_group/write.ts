import { RouteHandlerMethod } from "fastify";

const writePermissionGroup: RouteHandlerMethod = (req, rep) => {
  try {
    rep.send(req.body);
  } catch (e) {}
};

export default writePermissionGroup;
