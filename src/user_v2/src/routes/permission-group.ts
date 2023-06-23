import { FastifyPluginCallback } from "fastify";
import writePermissionGroup from "../handlers/permission_group/write";
import decodeJwt from "../pre-handler/decode-token";
import readPermissionGroup from "../handlers/permission_group/read";

const userRouter: FastifyPluginCallback = (f, opts, done) => {
  f.route({
    method    : 'GET',
    url       : "/",
    preHandler: [decodeJwt],
    handler   : readPermissionGroup,
  });

  f.route({
    method    : 'POST',
    url       : "/",
    preHandler: [decodeJwt],
    handler   : writePermissionGroup,
  });

  done();
}

export default userRouter;