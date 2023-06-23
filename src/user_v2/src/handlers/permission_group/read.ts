import { RouteHandlerMethod } from "fastify";

const readPermissionGroup: RouteHandlerMethod = (req, rep) => {
  try {
    rep.send('hello world');
  } catch (e) {
  }
}

export default readPermissionGroup;